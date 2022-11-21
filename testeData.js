var data = new Date(2022, 11-1, 19, 16, 36, 30, 123); // sempre vai converter para utc
console.log(data)
//data vira a data utc
var data1 = new Date(); //sempre utc
console.log('data UTC', data1, typeof(data1));
//new Date(year,month,day,hours,minutes,seconds,ms)
console.log('data informada:',data,typeof(data));
console.log(data.getHours()); //aqui sempre no seu fuso horario
console.log(data.getMinutes());//aqui sempre no seu fuso horario
console.log(data.getSeconds());//aqui sempre no seu fuso horario

var dataNow = new Date();
console.log('agora',typeof(dataNow));
console.log(dataNow.getHours())

// Date object initialized as per New Zealand timezone. Returns a datetime string
// let nz_date_string = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
// console.log('local', nz_date_string)

let xx = new Date()
let horas = xx.getHours();
let min = xx.getMinutes();
let seg = xx.getSeconds();
let datalocal = new Date(2022, 10, 20, 0, 39, 0) // sempre vai converter para utc
var data      = new Date(2022, 10, 20, 16, 36, 30, 123);  // sempre vai converter para utc
console.log(data, datalocal)


