import React,{useLayoutEffect,useEffect,useState} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './App.css';
import { Button } from '@material-ui/core';





function App() {
  const [drawing, setdrawing]=useState("false");
  const [elements,setelements]=useState([]);
  const [Ctx,setContext]=useState([]);
  const [todraw,setdraw]=useState('none');
  const [preX,setpreX]=useState('0');
  const [preY,setpreY]=useState('0');
   const [linepoints,setlinepoints]=useState([]);

  const draw=(element)=>{
    const {X1,Y1,X2,Y2,drawing}=element;
   // console.log(X1+" "+Y1+" "+X2+" "+Y2);
 
  if(drawing==="Rectangle")
 {
  Ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1);
  
 }
 else if(drawing=="Line")
 {
  Ctx.beginPath(); 
  Ctx.moveTo(X1,Y1);
  Ctx.lineTo(X2,Y2);
  Ctx.stroke();
  
 }
 else if(drawing=="Pen")
 {
    Ctx.beginPath();
    const {pointarray,drawing}=element;
    if(pointarray.length>0)
    {
    const {X1,Y1}=pointarray[0];
    Ctx.moveTo(X1,Y1);

    pointarray.map( ({X1,Y1})=>{
      //console.log(X1,Y1);
      
      Ctx.lineTo(X1,Y1);
      Ctx.stroke();
      
    });
  }
 }

   return ;

  }
  const undo=()=>{
     const present_state=elements;
    // console.log(elements);
     if(present_state.length>0)
     {
      present_state.pop();
     }

      //console.log(present_state);
      clear();

     setelements(present_state);
    reRender();
     
     Ctx.strokeRect('0','0','2','2');
  }


  // handle change of radio buttons
  const handleChange= (event)=>{
    setdraw(event.target.value);
   if(event.target.value==="Clear")
   {
     clear();
   }
   

  }
  


  // clear the screen
  const clear=( )=>{
      Ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
     setelements([]);
    }
  
  // handling the clicking down of mouse
  const handleMouseDown= (event)=>{
    setdrawing(true);
  //const canvas =document.getElementById('whiteboard');
  //const ctx=Canvas.getContext('2d');
   const {clientX,clientY}=event;
   if(todraw==="Pen")
   {
   
  //  Ctx.beginPath();
  const drawing=todraw;
  const X1=clientX;
  const Y1=clientY;
  const linepoint=[{X1,Y1}];
  setlinepoints(linepoint);
  const pointarray=linepoints;
  const element={pointarray,drawing} ;
 
  
   //Ctx.moveTo(clientX,clientY);
  // Ctx.lineTo(clientX,clientY);
  // Ctx.stroke();
  setelements(prevState=>[...prevState,element]);

   }
   else if(todraw==="Rectangle"||todraw==="Line")
   {
     setpreX(clientX);
     setpreY(clientY);
     const drawing=todraw;
     const X1=clientX;
     const Y1=clientY;
     const X2=clientX;
     const Y2=clientY;
      const element={X1,Y1,X2,Y2,drawing};
   // console.log(element);
    setelements(prevState=>[...prevState,element]);
    
    Ctx.strokeRect(clientX,clientY,0,0);
     


     
   }
   
    return ;

  }


  //handling the mouse motion
  const handleMouseMove=(event)=>{
    if(!drawing)
    return ;
    //const canvas =document.getElementById('whiteboard');
   // const Ctx=Canvas.getContext('2d');
   const {clientX,clientY}=event;
     
   if(todraw==="Pen") 
   {
    // Ctx.lineTo(clientX,clientY); 
    // Ctx.stroke();
    const index=elements.length-1;
   const X1=clientX;
   const Y1=clientY;
   const linepoint={X1,Y1};
   const drawing=todraw;
  setlinepoints(prevState=>[...prevState,linepoint]);
  const pointarray=linepoints;  
  const element={pointarray,drawing};
  const elementsCopy=[...elements];
  elementsCopy[index]=element;
  setelements(elementsCopy);
   

   }
   else if(todraw==="Rectangle"||todraw==="Line")
   {
    const index=elements.length-1;
    const drawing=todraw;
    const X1=preX;
    const Y1=preY;
    const X2=clientX;
    const Y2=clientY;
    const element={X1,Y1,X2,Y2,drawing};
   //console.log(element);
    const elementsCopy=[...elements];
     elementsCopy[index]=element;
     setelements(elementsCopy);
   //  Ctx.strokeRect(preX,preY,clientX,clientY);
   }


}



  //handling the mouseup 
  const handleMouseUp=(event)=>{
    setdrawing(false); 
    const {clientX,clientY}=event; 
    
    if(todraw==="Pen")
    {
   // const ctx=Canvas.getContext('2d');
   Ctx.stroke();
    }
    else if(todraw==="Rectangle")
    {
     // Ctx.strokeRect(preX,preY,clientX-preX,clientY-preY);
    } 
    return ;
  }


  // calls each time when layout changes
  useEffect( ()=>{
    
    const canvas=document.getElementById("whiteboard");
    const context=canvas.getContext('2d');
    setContext(context);
    context.clearRect(0,0,window.innerWidth,window.innerHeight);
    elements.forEach((element)=>
     {
       draw(element);
      
      // console.log(elements.length);
      
  //  console.log(element);
     }
    );
    
  },[elements,]);
    
   
  function reRender()
  {
    const canvas=document.getElementById("whiteboard");
    const context=canvas.getContext('2d');
    setContext(context);
    context.clearRect(0,0,window.innerWidth,window.innerHeight);
    elements.forEach((element)=>
     {
       draw(element);
      
      // console.log(elements.length);
      
  //  console.log(element);
     }
    );
  }


  return (
       <div>
          <div className="drawing" style={{position:" fixed"}}>
          <FormControl component="fieldset">
      <FormLabel component="legend">Drawing tools</FormLabel>
      <RadioGroup aria-label="drawingtools" name="tools" value={todraw} onChange={handleChange}>
        <FormControlLabel value="Pen" control={<Radio />} label="Pen" />
        <FormControlLabel value="Rectangle" control={<Radio />} label="Rectangle" />
        <FormControlLabel value="Line" control={<Radio />} label="Line" />
        
        <FormControlLabel value="Clear" control={<Radio />} label="Clear" />
        
        <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
      </RadioGroup>
    </FormControl>
    <Button  onClick={undo}> Undo</Button>
          </div>

       
       <canvas id="whiteboard" width={window.innerWidth} height={window.innerHeight} 
       onMouseDown ={handleMouseDown}
       onMouseUp ={handleMouseUp}
       onMouseMove={handleMouseMove}
      
       
       >
  Canvas 
  
   </canvas>

   </div>
     

  );
}

export default App;
