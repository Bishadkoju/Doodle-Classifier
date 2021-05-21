const len=784;
const total_data=1000;

const CAT=0;
const RAINBOW=1;
const TRAIN =2;

let cats_data;
let trains_data;
let rainbows_data;

let cats={};
let trains={};
let rainbows={};

function preload(){
 cats_data=loadBytes("data/cat1000.bin");
 rainbows_data=loadBytes("data/rainbow1000.bin");
 trains_data=loadBytes("data/train1000.bin");
 
}
function prepareData(category,data,label){
  category.training=[];
  category.testing=[];
  for(let i=0;i<total_data;i++){
    let offset=i*len;
    let threshold=floor(0.8*total_data) 
    if(i<threshold){
    category.training[i]=data.bytes.subarray(offset,offset+len)
    category.training[i].label=label;
    }else{
      category.testing[i-threshold ]=data.bytes.subarray(offset,offset+len)
      category.testing[i-threshold ].label=label;
    }
  }
}

function trainEpoch(training){
  shuffle(training,true);
  for(let i=0;i<training.length;i++){
    let data=training[i];
    let inputs=data.map(x=>x/255.0);
    let label=training[i].label;
    let targets=[0,0,0];
    targets[label]=1;
    nn.train(inputs,targets);
   
    //console.log(i);
  }
}

function testAll(testing){
  let correct=0;
  for(let i=0;i<testing.length;i++){
    let data=testing[i];
    let inputs=data.map(x=>x/255.0);
    let label=testing[i].label;
    
    let guess=nn.predict(inputs)

    let m=max(guess)
    let classification=guess.indexOf(m);
    if (classification == label){
      correct++
    }
  }
  let percent=correct/testing.length;
  return percent;
}

function setup() {
  // put setup code here
  createCanvas(280,280);
  background(0);
  prepareData(cats,cats_data,CAT)
  prepareData(rainbows,rainbows_data,RAINBOW)
  prepareData(trains,trains_data,TRAIN)

  nn=new NeuralNetwork(784,64,3);

  let training =[];
  training =training.concat(cats.training)
  training =training.concat(rainbows.training)
  training =training.concat(trains.training)
  

  //Train for one epoch
  


let testing =[];
testing =testing.concat(cats.testing)
testing =testing.concat(rainbows.testing)
testing =testing.concat(trains.testing)
 for(let i=1;i<6;i++){
trainEpoch(training);
//console.log(testing)#
  percent=testAll(testing);
  console.log('Epoch :'+ i);
  console.log("Accuracy = "+percent);
}
 
  

  // let total=100;
  // for(let n=0;n<total;n++){
  //   let img=createImage(28,28);
  //   img.loadPixels();
  //   let offset=n*784;
  //   for(let i=0;i<784;i++){
  //     let val=255- cats_data.bytes[i+offset];
  //     img.pixels[i*4+0] = val;
  //     img.pixels[i*4+1] = val;
  //     img.pixels[i*4+2] = val;
  //     img.pixels[i*4+3] = 255;
  //   }
  //   img.updatePixels();
  //   let x=(n%10)*28;
  //   let y=floor(n/10)*28;
  //   image(img,x,y);
  //}








}



