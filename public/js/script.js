
//Aplayer
 const aplayer =document.getElementById('aplayer')
if(aplayer){
    let datasong=aplayer.getAttribute('data-song')
    let singer=aplayer.getAttribute('data-singer')
    datasong=JSON.parse(datasong)
    singer=JSON.parse(singer)
    const ap = new APlayer({
        container:aplayer,
        audio: [{
            name: datasong.title,
            artist: singer.fullName,
            url: datasong.audio,
            cover: datasong.avatar
        }],
        autoplay:true
    });

    const avatar=document.querySelector(".singer-detail .inner-avatar")
    const avatar2=document.querySelector('.aplayer .aplayer-pic')
    ap.on('play',function(){
        // avatar.style.animationPlayState  = "running";
        avatar2.style.animationPlayState  = "running";
    })
    ap.on('pause',function(){
        // avatar.style.animationPlayState  = "paused";
        avatar2.style.animationPlayState  = "paused";
    })
    ap.on('end',function(){
        // avatar.style.animationPlayState  = "paused";
        avatar2.style.animationPlayState  = "paused";
    })
}
//Aplayer
const buttonLike=document.querySelector('[button-like]')
if(buttonLike){
    buttonLike.addEventListener('click',()=>{
        const id=buttonLike.getAttribute('button-like')
        const data={
            id:id,
            
        }
        if(buttonLike.classList.contains('active')){
             buttonLike.classList.remove('active')   
             data.type="dislike"
        }else{
            buttonLike.classList.add('active')
            data.type="like"
        }
        fetch("/songs/like", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
            .then(res=>res.json())
            .then(data=>{
                if(data.code==200){
                    const innerNumber=buttonLike.querySelector('.inner-number')
                    innerNumber.innerHTML=data.updateLike
                }
            })
        

    })
}


const ListbuttonFavo=document.querySelectorAll('[button-favorite]')
if(ListbuttonFavo.length>0){
    ListbuttonFavo.forEach((buttonFavo)=>{
    buttonFavo.addEventListener('click',()=>{
        const id=buttonFavo.getAttribute('button-favorite')
        console.log(id)
        const data={
            id:id,
        }
        fetch("/songs/favorite", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
            .then(res=>res.json())
            .then(data=>{
                if(buttonFavo.classList.contains('active') && data.check=="delete"){
                    buttonFavo.classList.remove('active')   
                }else{
                    buttonFavo.classList.add('active')
                }
            })
        })
        

    })
}

//suggestion
const boxSearch=document.querySelector('.box-search')
if(boxSearch){
    const inputSearch=boxSearch.querySelector(`input[name='keyword']`)
    inputSearch.addEventListener('keyup',()=>{
        const keyword=inputSearch.value;
        fetch(`/songs/search/suggest?keyword=${keyword}`)
            .then(res => res.json())
            .then(data=>{
                if(data.code==200){
                    const htmlSong=data.songs.map(item=>
                        `
                        <a class="inner-item" href="/songs/detail/${item.slug}">
                        <div class="inner-image">
                          <img src="${item.avatar}">
                        </div>
                        <div class="inner-info">
                          <div class="inner-title">${item.title}</div>
                          <div class="inner-singer">
                            <i class="fa-solid fa-microphone-lines"></i> ${item.singerFullName}
                          </div>
                        </div>
                      </a>
                      `
                    )
                    const innerSuggest=boxSearch.querySelector('.inner-suggest')
                    const innerList=innerSuggest.querySelector('.inner-list')
                    innerSuggest.classList.add('show')
                    innerList.innerHTML=htmlSong.join("")

                    if(data.songs.length>0){
                        innerSuggest.classList.add('show')
                    }else{
                        innerSuggest.classList.remove('show')
                    }
                }
            })
    })
}
// end suggestion