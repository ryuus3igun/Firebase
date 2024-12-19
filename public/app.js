// var dataFloatPath = 'test/float';
// var dataIntPath = 'test/int';

// // Get a database reference 
// const databaseFloat = database.ref(dataFloatPath);
// const databaseInt = database.ref(dataIntPath);

// // Variables to save database current values
// var floatReading;
// var intReading;

// // Attach an asynchronous callback to read the data
// databaseFloat.on('value', (snapshot) => {
//   floatReading = snapshot.val();
//   console.log(floatReading);
//   document.getElementById("reading-float").innerHTML = floatReading;
// }, (errorObject) => {
//   console.log('The read failed: ' + errorObject.name);
// });

// databaseInt.on('value', (snapshot) => {
//   intReading = snapshot.val();
//   console.log(intReading);
//   document.getElementById("reading-int").innerHTML = intReading;
// }, (errorObject) => {
//   console.log('The read failed: ' + errorObject.name);
// });

var dataFloatPath = 'test/float';
var dataIntPath = 'test/int';

// Get a database reference 
const databaseFloat = database.ref(dataFloatPath);
const databaseInt = database.ref(dataIntPath);

// Variables to save database current values
var floatReading;
var intReading;

// Chart.js Setup
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Thời gian thực sẽ được thêm vào đây
        datasets: [
            {
                label: 'Flame (%)',
                data: [],
                borderColor: 'red',
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
                tension: 0.4 
            },
            {
                label: 'Other Sensor (%)',
                data: [],
                borderColor: 'blue',
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        animation: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (hh:mm:ss)'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sensor Value (%)'
                }
            }
        }
    }
});


// Update data and chart in real-time
databaseFloat.on('value', (snapshot) => {
    floatReading = snapshot.val();
    console.log('Float Reading:', floatReading);
    document.getElementById("reading-float").innerHTML = floatReading;

    const currentTime = new Date().toLocaleTimeString();

    // Kiểm tra và cập nhật biểu đồ
    if (chart.data.labels.length > 20) { // Giới hạn hiển thị 20 điểm
      chart.data.labels.shift();
      chart.data.datasets[1].data.shift();
    }
    // Cập nhật dữ liệu cho biểu đồ
    chart.data.labels.push(currentTime);
    chart.data.datasets[1].data.push(floatReading);
    console.log(floatReading, chart.data.datasets[1].data);
    chart.update();
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});

databaseInt.on('value', (snapshot) => {
    intReading = snapshot.val();
    console.log('Int Reading:', intReading);
    document.getElementById("reading-int").innerHTML = intReading;

    const currentTime = new Date().toLocaleTimeString();
    // Cập nhật dữ liệu cho biểu đồ
    chart.data.datasets[0].data.push(intReading);
    chart.update();
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});