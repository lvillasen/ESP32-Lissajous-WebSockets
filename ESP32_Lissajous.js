
var printData = 0;
var n_read = 0;
var data_out = document.getElementById("display_data");
var points_max = parseInt(document.getElementById("points_max").value)+1;
data_out.style.display = "none";
var ws;

/*applyOrientation();

window.onresize = function(event) {
        applyOrientation();
    }

function applyOrientation() {
    
var my_element = document.getElementById("plot_data");

    my_element.scrollIntoView({
  behavior: "smooth",
  block: "start",
  inline: "nearest"
});
}
*/
    




var result1000 = [];
var result = [];
var data1000 = [] ; 
var data_tot = [];
var data_tot2 = [];
var columnX;
var columnY;

var n_read = 0;

var chunk = "";



function ws_onmessage(e_msg) {
  e_msg = e_msg || window.event; // MessageEvent
  console.log(e_msg.data);
     
    try {
            n_read = n_read + 1;
            //console.log(n_read);
            data1000.push(e_msg.data);
            console.log(data1000);
            //result1000 = data1000.split(/\r?\n/);
            //console.log(result1000);
            columnX = parseInt(document.getElementById("ColumnX").value);
            columnY = parseInt(document.getElementById("ColumnY").value);

            points_max = parseInt(document.getElementById("points_max").value)+1;
            
            data_tot = [];
            data_tot2 = [];
            if (data1000.length > points_max) {
                result = data1000.slice(result1000.length-points_max,result1000.length-1);
              
                for (let i = 0;i<result.length;i++){
                    data_tot.push(String(result[i]).split(' ')[columnX]);
                    data_tot2.push(String(result[i]).split(' ')[columnY]);
            }

            } else {
                result = data1000;
                for (let i = 0;i<result.length-1;i++){
                    data_tot.push(String(result[i]).split(' ')[columnX]);
                    data_tot2.push(String(result[i]).split(' ')[columnY]);
            }
            }


            updatePlot();
        
    } catch (error) {
        printData = 1;
        updatePlot();
        console.error('Error:', error);
    
}
}


function updatePlot(){
    var X_axis = [];
    //var XX = [];
    //var YY = [];
    for (var i = 0; i < data_tot.length; i++) {
      X_axis.push(i);
    }
    /*
    for (var i = 0; i < data_tot.length-1; i++) {
      XX.push(data_tot[i]);
      YY.push(data_tot2[i]);
    }
    */

    var traceX = {
x: X_axis,
y: data_tot,
  mode: 'markers+lines',
  name: 'Red CD',
    line: {
    color: 'red',
    width: 2,
    dash: 'line'
  }
};

    var traceY = {
x: X_axis,
y: data_tot2,
  mode: 'markers+lines',
  name: 'Red CD',
    line: {
    color: 'green',
    width: 2,
    dash: 'line'
  }
};

var lastX = [data_tot[data_tot.length-1]];
var lastY = [data_tot2[data_tot2.length-1]];

var traceXY = {
x: data_tot,
y: data_tot2,
  mode: 'markers+lines',
  name: 'Total',
    line: {
    color: 'blue',
    width: 2,
    dash: 'line'
  }
};
var traceXYLast = {
x: lastX,
y: lastY,
    marker: {
    color: 'red',
    size: 15
  },
  mode: 'markers',
  name: 'Last',
    line: {
    color: 'white',
    width: 2,
    dash: 'line'
  }
};
  


    var dataX =[traceX]
    var layoutX = {
              xaxis: {
                  //   range: [0, N],
                  title: "Sample Number"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Column " + String(columnX)
              },
              title: "Data for Column "+ String(columnX) ,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };
var dataY =[traceY]
var layoutY = {
              xaxis: {
                  //   range: [0, N],
                  title: "Sample Number"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Column " + String(columnY)
              },
              title: "Data for Column " + String(columnY) ,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };

    var dataXY =[traceXY,traceXYLast]
    var layoutXY = {
              xaxis: {
                range: [-1.1, 1.1],
                title: "Column  " + String(columnX)
              },
              yaxis: {
                range: [-1.1, 1.1],
                title: "Column " + String(columnY)
              },
              title: "Column " + String(columnY) +" vs Column " + String(columnX),font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };


          Plotly.purge("plot_dataX");
    Plotly.newPlot("plot_dataX", dataX, layoutX);
          Plotly.purge("plot_dataY");
    Plotly.newPlot("plot_dataY", dataY, layoutY);

    Plotly.newPlot("plot_dataXY", dataXY, layoutXY);
if (printData == 1){
    print_data();
}
}

function print_data(){
  data_out.style.display = "block";
  data_out.textContent = "Row    Columns    \n";
  for (let i = 0;i<result.length ;i++){      
    data_out.textContent += i + " " + String(result[i]) + "\n"
  }
  printData = 0;
}

function connect_onclick() {
  if(ws == null) {
    const ip = String(document.getElementById("ip").value);
    ws = new WebSocket("ws://"+ip + ":81");

    document.getElementById("ws_state").innerHTML = "CONNECTING";
    ws.onopen = ws_onopen;
    ws.onclose = ws_onclose;
    ws.onmessage = ws_onmessage;
  } else
    ws.close();
}

function ws_onopen() {
  document.getElementById("ws_state").innerHTML = "<span style='color:blue'>CONNECTED</span>";
  document.getElementById("bt_connect").value = 'Disconnect';
  printData = 0;
  data_out.style.display = "none";
  send_f1();
  send_f2();
  send_p1();
  send_p2();
  send_sr();
  data1000 = [];
  

}

function ws_onclose() {
  document.getElementById("ws_state").innerHTML = "<span style='color:gray'>CLOSED</span>";
  document.getElementById("bt_connect").value = 'Connect';
  ws.onopen = null;
  ws.onclose = null;
  ws.onmessage = null;
  ws = null;
  printData = 1;
  print_data();
}

function send_onclick() {
  if(ws != null) {
    var message = document.getElementById("message").value;
    
    if (message) {
      document.getElementById("message").value = "";
      ws.send(message + "\n");
      update_text('<span style="color:navy">' + message + '</span>');
      // You can send the message to the server or process it as needed
    }
  }
}

function update_text(text) {
  var chat_messages = document.getElementById("chat-messages");
  chat_messages.innerHTML += text + '<br>';
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

function send_f1() {
    const newF1 = parseFloat(document.getElementById("f1").value);
    ws.send('setF1:' + newF1);
}

function send_f2() {
    const newF2 = parseFloat(document.getElementById("f2").value);
    ws.send('setF2:' + newF2);
}

function send_p1() {
    const newP1 = parseFloat(document.getElementById("p1").value);
    ws.send('setP1:' + newP1);
}

function send_p2() {
    const newP2 = parseFloat(document.getElementById("p2").value);
    ws.send('setP2:' + newP2);
}

function send_sr() {
    const newSR = parseFloat(document.getElementById("sampling_rate").value);
    ws.send('setSR:' + newSR);
}
