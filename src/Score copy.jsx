import React, { useState, useEffect, useRef } from 'react'
import { useSpeechSynthesis  } from 'react-speech-kit';
import 'remixicon/fonts/remixicon.css'

const Score = () => {

//   const [scores, setScores] = useState({
//     id:'',
//     data:[{name:{
//     a:'',
//     b:''
//   },
// score:{
//   a:'',
//   b:''
// },
// winset:{
//   a:'',
// b:''
// }
// }]})

const [scores, setScores] = useState({data:[]})

  const [name, setName] = useState('')
  const [editNameA, setEditNameA] = useState(false)
  const teamAinput = useRef()

  const [editNameB, setEditNameB] = useState(false)
  const teamBinput = useRef()
const [id, setId] = useState(0)

//Get Scores from LocalStorage
const localScores = JSON.parse(localStorage.getItem("scores")) || []
const [detailScores, setDetailScores] = useState(false)

  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)

  const [winSetA, setWinSetA] = useState(0)
  const [winSetB, setWinSetB] = useState(0)

  const [teamA, setTeamA] = useState('Team A')
  const [teamB, setTeamB] = useState('Team B')

  const [notifSaveScores, setNotifSaveScores] = useState(false)
  const [notifFailedScores, setNotifFailedScores] = useState(false)
  const [notifDeleteScore, setNotifDeleteScore] = useState(false)

  const [switchTeam, setSwitchTeam] = useState(false)
  const [switchBall, setSwitchBall] = useState(false)
  const [listScores, setListScores] = useState(false)

  const [idState, setIdState] = useState(new Date().getTime());
  
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

  const [voiceIndex, setVoiceIndex] = useState(null);

  const dataConfirm = (dataID) => {
    const localData = localScores.filter(score => score.id == dataID)

return localData.id ? true : false
 }

 const deleteScore = (event) => {
  const dataId = event.currentTarget.dataset.id;
  const localData = localScores.filter(score => score.id != dataId)
  setNotifDeleteScore(true)
  localStorage.setItem("scores", JSON.stringify(localData));
  setTimeout(() => setNotifDeleteScore(false), 1500);
  console.log(event.target)
  console.table(localData)
  setDetailScores(false)
 }

const count = (event) => {
  const dataSet = event.currentTarget.dataset.name;

// Speak for WinSet
  const winSet = (teamOne, teamTwo) => {
return speak({ text: `kelasemen sementara adalah Tim A ${!switchTeam ? teamOne : teamTwo} poin dan Tim B ${!switchTeam ? teamTwo : teamOne} poin` , voice })
  }

// Speak for Switch Ball
 const scoreSpeak = (scoreLeft, scoreRight) => {
  return scoreLeft == scoreRight ? `${scoreLeft}, sama` : switchBall ? `${scoreLeft}, ${scoreRight}` : `${scoreRight}, ${scoreLeft}`
 }

// Save Score to State
const saveScoreState = (scoreA, scoreB, winSetA, winSetB) => {

  setScores({
    id: idState,
    time: new Date(),
    data: [...scores.data,
{
  name:{a: switchTeam ? teamB : teamA,
  b: switchTeam ? teamA : teamB},
  winset: {a: switchTeam ? winSetB : winSetA,
  b: switchTeam ? winSetA : winSetB},
  score: {
    a: switchTeam ? scoreB : scoreA,
    b: switchTeam ? scoreA : scoreB
  }
}
    ]
  })
}

 // Counting
  switch(dataSet){
    case 'subtScoreA':
      scoreA != 0 && setScoreA(scoreA-1) 
      speak({ text: scoreSpeak(scoreA-1,scoreB), voice })
      break;
    case 'addScoreA':
      setScoreA(scoreA+1)
      speak({ text: scoreSpeak(scoreA+1,scoreB), voice })
      break;
    case 'subtScoreB':
      scoreB != 0 && setScoreB(scoreB-1)
      speak({ text: scoreSpeak(scoreA,scoreB-1), voice })
      break;
    case 'addScoreB':
    setScoreB(scoreB+1)
    speak({ text: scoreSpeak(scoreA,scoreB+1), voice })
    break;
    case 'subtWinSetA':
      winSetA != 0 && setWinSetA(winSetA-1)
      winSet(winSetA-1, winSetB)

    //   scores.data.filter(score => score.winset.a > winSetA-1).map(score => {
    //     score.winset.a = winSetA-1
    //     score
    //   })
      
    //   const dataBeforeLastA = scores.data.filter(score => score.winset.a != winSetA-1)

    //   setScores({
    //     id: idState,
    //     time: new Date(),
    //     data: [...dataBeforeLastA,
    // {
    //   name:{a: switchTeam ? teamB : teamA,
    //   b: switchTeam ? teamA : teamB},
    //   winset: {a: switchTeam ? winSetB-1 : winSetA-1,
    //   b: switchTeam ? winSetA : winSetB},
    //   score: {
    //     a: switchTeam ? scoreB : scoreA,
    //     b: switchTeam ? scoreA : scoreB
    //   }
    // }
    //     ]
    //   })
      break;
      case 'addWinSetA':
        setWinSetA(winSetA+1)
        winSet(winSetA+1, winSetB)
        saveScoreState(scoreA, scoreB, winSetA+1, winSetB)
      break;
    case 'subtWinSetB':
      winSetB != 0 && setWinSetB(winSetB-1)
      winSet(winSetA, winSetB-1)

      const dataFilter = scores.data.filter(score => score.winset.b <= winSetB-1)

      console.log(dataFilter)
      
    //   const dataBeforeLastB = scores.data.filter(score => score.winset.b != winSetB-1)

    //   setScores({
    //     id: idState,
    //     time: new Date(),
    //     data: [...dataBeforeLastB,
    // {
    //   name:{a: switchTeam ? teamB : teamA,
    //   b: switchTeam ? teamA : teamB},
    //   winset: {a: switchTeam ? winSetB : winSetA,
    //   b: switchTeam ? winSetA-1 : winSetB-1},
    //   score: {
    //     a: switchTeam ? scoreB : scoreA,
    //     b: switchTeam ? scoreA : scoreB
    //   }
    // }
    //     ]
    //   })
      break;
      case 'addWinSetB':
        setWinSetB(winSetB+1)
        winSet(winSetA, winSetB+1)
        saveScoreState(scoreA, scoreB, winSetA, winSetB+1)
        break;
      case 'newGame':
        setWinSetA(0)
        setWinSetB(0)
        setScoreA(0)
        setScoreB(0)
        setTeamA('Team A')
        setTeamB('Team B')
        setScores({data:[]})
      break;
      case 'scoreReset':
        setScoreA(0)
        setScoreB(0)
        break;
      case 'switchTeam':
        switchTeam ? setSwitchTeam(false) : setSwitchTeam(true)
        setScoreA(scoreB)
        setScoreB(scoreA)
        setWinSetA(winSetB)
        setWinSetB(winSetA)
        setTeamA(teamB)
        setTeamB(teamA)
      break;
      case 'saveScores':
        
      if(winSetA != 0 || winSetB != 0 ){
        localStorage.setItem("scores", JSON.stringify([...localScores, scores]));

                setNotifSaveScores(true)
                setTimeout(() => setNotifSaveScores(false), 1500);
        }else{
          setNotifFailedScores(true)
          console.log('gagal simpan skor')
          setTimeout(() => setNotifFailedScores(false), 1500);
        }

        break;
        case 'gamePoint':
          speak({ text: "Game Poin", voice })
        break;
        case '2ball':
          speak({ text: "Bola ke 2", voice })
          break;
          case 'matchPoint':
            speak({ text: "Match Poin", voice })
            break;
  }
}

const switchBallHandle = () => {
  switchBall ? setSwitchBall(false) : setSwitchBall(true)
  speak({ text: "Pindah Bola", voice })
}

useEffect(()=>{
  if(editNameA){
  teamAinput.current.focus()
  }else if(editNameB){
    teamBinput.current.focus()
  }

  setInterval(() => setIdState(new Date().getTime()+idState+1), 1000);

},[editNameA, editNameB, scores, idState])

const voice = voices[157] || null;

return (
<>


<div className="bg-gradient-to-r from-[#9ED5C5] to-[#E97777] grid sm:grid-cols-[1fr_1.5fr_1fr] sm:h-screen sm:w-screen sm:gap-x-[20px] sm:gap-y-[10px] gap-[12px] justify-evenly grid-cols-2 h-full">

{/* ---Left Team--- */}
  <div className="h-[50vh] sm:h-screen p-4 rounded grid sm:grid-rows-[1fr_0.5fr_1.5fr_1.5fr_1.5fr_0.5fr_1fr_0.5fr] sm:grid-cols-1">
    <div className="backdrop-blur-lg bg-[#ffffff4d] w-full border-4 border-[#ffffff4d] text-8 text-center text-white font-bold rounded-xl flex items-center justify-evenly cursor-pointer">
      {editNameA ? <form className="flex items-center"><input type="text" value={teamA} className="w-full h-10 bg-transparent focus:outline-none px-4" ref={teamAinput} onChange={(e)=> setTeamA(e.target.value)} /><div type='submit' className="text-[2em] px-4" onClick={(e)=> {
        e.preventDefault()
        setEditNameA(false)
        }}><i className="ri-check-line"></i></div></form> : <><span>{teamA}</span> <i className="ri-pencil-line text-[1.7em] cursor-pointer" onClick={()=> {
          setEditNameA(true)
          teamAinput.current.focus()
          console.log(teamAinput.current)
          }}></i></>}
    </div>
    <div className="backdrop-blur-lg bg-[#ffffff4d] rounded-3xl border-4 border-[#ffffff4d] text-9xl  text-white flex justify-center items-center row-start-3 row-end-6">{scoreA}
    {switchBall && <i className="ri-ping-pong-fill text-[36px] text-[#BA94D1] right-0 absolute"></i>}
    </div>
    <div className="grid grid-cols-4 row-start-7">
      <div name='minA' className="bg-gradient-to-r from-[#BA94D1] to-[#7F669D] rounded-xl text-center flex justify-center items-center md:text-16 text-white cursor-pointer border-0" data-name="subtScoreA" onClick={count}><i className="ri-subtract-line"></i></div>
      <div className="bg-gradient-to-r from-[#BA94D1] to-[#7F669D] rounded-xl text-center flex justify-center items-center md:text-16 text-white cursor-pointer border-0 col-start-4" data-name="addScoreA" onClick={count}><i className="ri-add-line"></i></div>
    </div>
  </div>
{/* End Left Team */}

{/* ---Center Panel--- */}
<div className="order-3 max-sm:col-span-2 sm:order-2 h-[50vh] sm:h-screen grid sm:grid-rows-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr_0.2fr] sm:grid-cols-1">

<div className="bg-[#ffffff4d] backdrop-blur-lg rounded-[15%] border-4 border-[#ffffff4d] row-start-2 row-end-7 w-[90%] sm:w-full mx-auto sm:mx-none grid sm:grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] sm:grid-cols-6">

{/* ---WinSet Point--- */}
    <div className="text-4xl place-self-center text-white col-start-2 place-self-center">{winSetA}</div>
    <div className="bg-gradient-to-r from-[#BA94D1] to-[#7F669D] rounded-xl sm:w-8 sm:h-8 w-8 h-8 text-center text-xl flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 place-self-end self-center col-start-1 row-start-2" data-name="subtWinSetA" onClick={count}><i className="ri-subtract-line"></i></div>
    <div className="bg-gradient-to-r from-[#BA94D1] to-[#7F669D] rounded-xl sm:w-8 sm:h-8 w-8 h-8 text-center text-xl flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 self-center col-start-3 row-start-2" data-name="addWinSetA" onClick={count}><i className="ri-add-line"></i></div>

    <div className="text-4xl text-white col-start-5 place-self-center">{winSetB}</div>
    <div className="bg-gradient-to-r from-[#FCDDB0] to-[#FF9F9F] rounded-xl sm:w-8 sm:h-8 w-8 h-8 text-center text-xl flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 place-self-end self-center col-start-4 row-start-2" data-name="subtWinSetB" onClick={count}><i className="ri-subtract-line"></i></div>
    <div className="bg-gradient-to-r from-[#FCDDB0] to-[#FF9F9F] rounded-xl sm:w-8 sm:h-8 w-8 h-8 text-center text-xl flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 place-self-start self-center col-start-6 row-start-2" data-name="addWinSetB" onClick={count}><i className="ri-add-line"></i></div>
{/* End WinSet Point */}

<i className="ri-arrow-left-right-fill cursor-pointer place-self-center self-end text-white text-[2em] col-start-3 col-span-2 row-start-1" data-name="switchTeam" onClick={count}></i>

{/* Line */}
  <span className="bg-[#ffffff4d] h-[4px] w-[90%] rounded-xl place-self-center col-start-1 col-span-6 row-start-3"></span>
{/* End Line */}

{/* ---Switch Ball--- */}
<div className="border-4 border-white rounded-full px-4 cursor-pointer place-self-center self-center col-start-3 col-span-2 row-start-4 hover:text-cyan-500" onClick={switchBallHandle}>
<i className="ri-arrow-left-right-fill text-white md:text-[2em]"></i>
</div>
{/* End Switch Ball */}

{/* ---List Scores Button--- */}
<div className="border-4 border-white rounded-xl px-4 cursor-pointer place-self-center self-end col-start-3 col-span-2 row-start-7 hover:text-cyan-500" onClick={()=> setListScores(true)}>
<i className="ri-menu-line text-white md:text-[2em]"></i>
</div>
{/* End List Scores Button */}

</div>

{/* Bottom Center Panel */}

<div className="flex justify-evenly rounded-xl items-center row-start-7">
<div className="w-fit h-fit p-4 text-white text-[1.5em] cursor-pointer hover:text-cyan-500 text-center" data-name="newGame" onClick={count}>
<i className="ri-add-box-fill block"></i>
<span className="text-[8px] block">New</span>
</div>
<div className="w-fit h-fit p-4 text-white text-[1.5em] cursor-pointer hover:text-cyan-500 text-center" data-name="saveScores" onClick={count}>
<i className="ri-save-2-fill block"></i>
<span className="text-[8px] block">Simpan</span>
</div>
<div className="w-fit h-fit p-4 text-white text-[1.5em] cursor-pointer hover:text-cyan-500 text-center" data-name="scoreReset" onClick={count}>
<i className="ri-arrow-go-forward-line block"></i>
<span className="text-[8px] block">Reset Skor</span>
</div>
</div>
{/* End Bottom Center Panel */}

</div>
{/* End Center Panel */}

  {/* ---Right Team--- */}
  <div className="sm:order-3 order-2 h-[50vh] sm:h-screen p-4 rounded grid sm:grid-rows-[1fr_0.5fr_1.5fr_1.5fr_1.5fr_0.5fr_1fr_0.5fr] sm:grid-cols-1">
  <div className="backdrop-blur-lg bg-[#ffffff4d] w-full border-4 border-[#ffffff4d] text-8 text-center text-white font-bold rounded-xl flex items-center justify-evenly cursor-pointer">
      {editNameB ? <form className="flex items-center"><input type="text" value={teamB} className="w-full h-10 bg-transparent focus:outline-none px-4" ref={teamBinput} onChange={(e)=> setTeamB(e.target.value)} /><div type='submit' className="text-[2em] px-4" onClick={(e)=> {
        e.preventDefault()
        setEditNameB(false)  
        }}><i className="ri-check-line"></i></div></form> : <><span>{teamB}</span> <i className="ri-pencil-line text-[1.7em] cursor-pointer" onClick={()=> {
          setEditNameB(true)
          teamBinput.current.focus()
          console.log(teamBinput)
          }}></i></>}
    </div>
    <div className="backdrop-blur-lg bg-[#ffffff4d] rounded-3xl border-4 border-[#ffffff4d] text-9xl  text-white flex justify-center items-center row-start-3 row-end-6">{scoreB}
    {!switchBall && <i className="ri-ping-pong-fill text-[36px] text-[#fb7185] right-0 absolute"></i>}
    </div>
    <div className="grid grid-cols-4 row-start-7">
      <div className="bg-gradient-to-r from-[#FCDDB0] to-[#FF9F9F] rounded-xl text-center flex justify-center items-center text-white cursor-pointer border-0" data-name="subtScoreB" onClick={count}><i className="ri-subtract-line"></i></div>
      <div className="bg-gradient-to-r from-[#FCDDB0] to-[#FF9F9F] rounded-xl text-center flex justify-center items-center text-white cursor-pointer border-0 col-start-4" data-name="addScoreB" onClick={count}><i className="ri-add-line"></i></div>
    </div>
  </div>
  {/* End Right Team */}

{/* ---Saved Scores Page--- */}
{listScores && 
  <>
<div className="bg-gradient-to-r to-[#9ED5C5] from-[#94a3b8] top-0 bottom-0 right-0 left-0 absolute z-20 grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr] h-full sm:h-screen sm:w-screen sm:gap-x-[20px] sm:gap-y-[10px] gap-[12px] animate-small-large">

    {/* ---Close Button---*/}    
  <div className="absolute inline-flex h-10 w-10 rounded-full bg-[#fb7185] text-[2em] text-white top-[1%] right-[40%] col-start-2 cursor-pointer z-50 flex justify-center items-center opacity-75" onClick={()=> setListScores(false)}><i className="ri-close-line opacity-100"></i>
  </div>
  {/* End Close Button */}

<div className="bg-[#ffffff4d] backdrop-blur-lg rounded-3xl sm:rounded-[15%] border-4 border-[#ffffff4d] w-[90%] mx-auto sm:w-full sm:mx-none sm:col-start-2 h-[90%] my-auto sm:gap-y-[5%] overflow-auto z-40 animate-small-large">
<div className="text-2xl text-center font-bold text-white fixe py-4">DAFTAR SKOR</div>

{/* ---Detail Scores Page--- */}
{detailScores ?
localScores.filter(score => score.id == id).map(score => 
<>
  <div className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[1fr_0.5fr_1fr_24px] h-[50%] py-8">
  <i className="ri-user-6-fill place-self-center text-[2em] text-[#7F669D]"></i>
  <span className="justify-self-center text-white text-2xl">
  {score.data[Object.keys(score.data).length-1].winset.a}
  </span>
  <span className="col-start-1 row-start-2 justify-self-center text-white">
  {score.data[Object.keys(score.data).length-1].name.a}
  </span>
  <div className="bg-gradient-to-r from-[#BA94D1] to-[#7F669D] rounded-xl w-fit px-2 h-[60%] w-8 h-8 text-center text-lg flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 col-start-1 col-span-2 row-start-3 place-self-center" onClick={()=> setDetailScores(false)}>KEMBALI</div>

  <i className="ri-user-6-fill col-start-4 place-self-center text-[2em] text-[#fb7185]"></i>
  <span className="col-start-3 row-start-1 justify-self-center text-white text-2xl">
  {score.data[Object.keys(score.data).length-1].winset.b}
  </span>
  <span className="col-start-4 justify-self-center text-white">
  {score.data[Object.keys(score.data).length-1].name.b}
  </span>
  <div className="bg-gradient-to-r to-[#E97777] from-[#FF9F9F] rounded-xl w-[50%] h-[60%] w-8 h-8 text-center text-lg flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 col-start-3 col-span-2 row-start-3 place-self-center" data-id={score.id} onClick={deleteScore}>HAPUS</div>

    </div>
<div className="bg-white rounded-tl-[8%] rounded-tr-[8%] w-full h-full">
<div className="flex justify-evenly items-center w-full h-[10%]">
  <span className="font-bold">
  {score.data[Object.keys(score.data).length-1].name.a}
    </span>
    <span className="font-bold">
    {score.data[Object.keys(score.data).length-1].name.b}
    </span>
</div>
{score.data.map(score => <>
<div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] grid-rows-3">
<span className="font-bold place-self-center col-start-2">
    {score.winset.a}
    </span>
    <span className="font-bold place-self-center row-start-2">
    {score.score.a}
    </span>
    <span className="col-start-3 place-self-center">:</span>
    <span className="font-bold place-self-center col-start-4">
    {score.winset.b}
    </span>
    <span className="font-bold place-self-center row-start-2 col-start-5">
    {score.score.b}
    </span>

    {/* Line */}
      <span className="bg-[#2925244d] h-[4px] w-[90%] rounded-xl row-start-3 col-start-1 col-span-5 place-self-center z-50"></span>
{/* End Line */}

</div>

</>)}
  
</div>


    {/* End Detail Scores */}
    </>)
     : 
<>
{!localScores == false ?  
  localScores.map(score => <>
  
{/* ---List Scores Page--- */}
  <div className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[1fr_0.5fr_1fr_24px] h-[50%] py-8" keys={score.id}>
  <i className="ri-user-6-fill place-self-center text-[2em] text-[#7F669D]"></i>
  <span className="justify-self-center text-white text-2xl">{score.data[Object.keys(score.data).length-1].winset.a}</span>
  <span className="col-start-1 row-start-2 justify-self-center text-white">{score.data[0].name.a}</span>
  <div className="bg-gradient-to-r from-[#BA94D1] to-[#7F669D] rounded-xl w-[50%] h-[60%] w-8 h-8 text-center text-lg flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 col-start-1 col-span-2 row-start-3 place-self-center" data-id={score.id} onClick={(event)=> {
    setDetailScores(true)
    setId(event.currentTarget.dataset.id)
    }}>DETAIL</div>

  <i className="ri-user-6-fill col-start-4 place-self-center text-[2em] text-[#fb7185]"></i>
  <span className="col-start-3 row-start-1 justify-self-center text-white text-2xl">{score.data[Object.keys(score.data).length-1].winset.b}</span>
  <span className="col-start-4 justify-self-center text-white">{score.data[0].name.b}</span>
  <div className="bg-gradient-to-r to-[#E97777] from-[#FF9F9F] rounded-xl w-[50%] h-[60%] w-8 h-8 text-center text-lg flex items-center justify-center text-white cursor-pointer max-sm:text-xl border-0 col-start-3 col-span-2 row-start-3 place-self-center" data-id={score.id} onClick={deleteScore}>HAPUS</div>

      {/* Line */}
      <span className="bg-[#ffffff4d] h-[4px] w-[90%] rounded-xl row-start-4 col-start-1 col-span-4 place-self-center"></span>
{/* End Line */}

    </div>
    </>
    ) : ''}
    </>
    }
</div>
</div>
</>}
{/* End List Scores Page */}

{/* End Saved Scores Page */}

{/* ---Notif Failed Save Scores--- */}
{notifFailedScores && <div className="w-fit h-fit p-4 absolute bg-[#64748b] text-white font-bold rounded-lg left-[50%] top-[10%] translate-y-[-50%] translate-x-[-50%]">Simpan Skor Gagal

    {/* ---Close Button---*/}    
    <div className="absolute inline-flex h-5 w-5 rounded-full bg-[#fb7185] text-white top-[-10%] right-[-5%] col-start-2 cursor-pointer z-50 flex justify-center items-center opacity-75" onClick={()=> setNotifFailedScores(false)}><i className="ri-close-line opacity-100"></i>
  </div>
  {/* End Close Button */}
</div>}
{/* End Notif Failed Save Scores */}

{/* ---Notif Save Scores--- */}
{notifSaveScores && <div className="w-fit h-fit p-4 absolute bg-[#34d399] text-white font-bold rounded-lg left-[50%] top-[10%] translate-y-[-50%] translate-x-[-50%]">Simpan Skor Berhasil

    {/* ---Close Button---*/}    
    <div className="absolute inline-flex h-5 w-5 rounded-full bg-[#fb7185] text-white top-[-10%] right-[-5%] col-start-2 cursor-pointer z-50 flex justify-center items-center opacity-75" onClick={()=> setNotifSaveScores(false)}><i className="ri-close-line opacity-100"></i>
  </div>
  {/* End Close Button */}
</div>}
{/* End Notif Failed Save Scores */}

{/* ---Notif Save Scores--- */}
{notifDeleteScore && <div className="w-fit h-fit p-4 absolute bg-[#e11d48] text-white font-bold rounded-lg left-[50%] top-[10%] translate-y-[-50%] translate-x-[-50%] z-[100]">Hapus data berhasil

    {/* ---Close Button---*/}    
    <div className="absolute inline-flex h-5 w-5 rounded-full bg-[#fb7185] text-white top-[-10%] right-[-5%] col-start-2 cursor-pointer z-50 flex justify-center items-center opacity-75" onClick={()=> setNotifDeleteScore(false)}><i className="ri-close-line opacity-100"></i>
  </div>
  {/* End Close Button */}
</div>}
{/* End Notif Failed Save Scores */}
</div>
</>             
  )
}

export default Score