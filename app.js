window.addEventListener("load", function onWindowLoad() {
  (function (palette) {
    for (var r = 0, max = 4; r <= max; r++) {
      for (var g = 0; g <= max; g++) {
        for (var b = 0; b <= max; b++) {
          var paletteBlock = document.createElement('div');
          paletteBlock.className = 'button';
          paletteBlock.addEventListener('click', function changeColor(strokeB) {
            brush.color = strokeB.target.style.backgroundColor;
          });

          paletteBlock.style.backgroundColor = (
            'rgb(' + Math.round(r * 255 / max) + ", "
            + Math.round(g * 255 / max) + ", "
            + Math.round(b * 255 / max) + ")"
          );

          palette.appendChild(paletteBlock);
        }
      }
    }
  })(document.getElementById("palette"));

  function empty_draw_data() {
    return {
      clickX: new Array(),
      clickY: new Array(),
      clickDrag: new Array(),
      clickColor: new Array(),
      clickSize: new Array()
    }
  };

  function add_draw_data(new_draw_data) {
    Object.keys(draw_data).forEach(function (key) {
      draw_data[key] = draw_data[key].concat(new_draw_data[key]);
    });
  }

  let
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    paint = false,
    brush = {
      size: 8,
      color: "#000000"
    },
    draw_data = empty_draw_data();

  //logic

  canvas.addEventListener('mousedown', function (e) {
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });

  canvas.addEventListener('mousemove', function (e) {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  canvas.addEventListener('mouseup', function (e) {
    paint = false;
  });

  canvas.addEventListener('mouseleave', function (e) {
    paint = false;
  });

  function addClick(x, y, dragging) {
    draw_data.clickX.push(x);
    draw_data.clickY.push(y);
    draw_data.clickDrag.push(dragging);
    draw_data.clickColor.push(brush.color);
    draw_data.clickSize.push(brush.size);
  }

  function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.lineJoin = "round";

    for (var i = 0; i < draw_data.clickX.length; i++) {
      context.beginPath();
      if (draw_data.clickDrag[i] && i) {
        context.moveTo(draw_data.clickX[i - 1], draw_data.clickY[i - 1]);
      } else {
        context.moveTo(draw_data.clickX[i] - 1, draw_data.clickY[i]);
      }
      context.strokeStyle = draw_data.clickColor[i];
      context.lineWidth = draw_data.clickSize[i];
      context.lineTo(draw_data.clickX[i], draw_data.clickY[i]);
      context.closePath();
      context.stroke();
    }
  }

  function clear() {
    draw_data = empty_draw_data();
    redraw();
  }

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 81) {
      brush.size = 8;
      console.log('small')
    }
    if (e.keyCode === 87) {
      brush.size = 16;
      console.log('medium');
    }
    if (e.keyCode === 69) {
      brush.size = 24;
      console.log('big')
    }
  });

  function save() {
    localStorage.setItem('draw_data', JSON.stringify(draw_data));
  }

  function load() {
    draw_data = JSON.parse(localStorage.getItem('draw_data'));
    redraw();
  }

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 83) {
      save();
      console.log('Saved')
      //save
    }
    if (e.keyCode === 82) {
      //replay
      console.log('Loading ...');
      load();
    }
    if (e.keyCode === 67) {
      //clear
      clear();
      console.log('Cleared')

    }
  });

  window.addEventListener('storage', function(e) {
    if(e.key === 'draw_data'){
      add_draw_data(JSON.parse(e.newValue));
      redraw();
    }
  });

});