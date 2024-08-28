import { useState, useEffect } from "react";
import MemeSlider from "../components/MemeSlider";
import api from "../contexts/api";

function TopMeme(){
    const [topView, setTopView] = useState([]);
    const [topLike, setTopLike] = useState([]);
    const [topWeek, setTopWeek] = useState([]);

    useEffect(()=> {
        const fetchTopView = async() =>{
            try {
                const response = await api.get('/meme-posts/ranks/all?sort=VIEW&page=0&size=20');
                setTopView(response.data.data)
            }catch(error){
                console.log('topView 불러오기 실패',error);
            }
        }
        fetchTopView()
    },[])

    useEffect(()=> {
        const fetchTopLike = async() =>{
            try {
                const response = await api.get('/meme-posts/ranks/all?sort=LIKE&page=0&size=20');
                setTopLike(response.data.data)
            }catch(error){
                console.log('topLike 불러오기 실패',error);
            }
        }
        fetchTopLike()
    },[])

    useEffect(()=> {
        const fetchTopWeek = async() =>{
            try {
                const response = await api.get('/meme-posts/ranks/period?period=WEEK&page=0&size=20');
                setTopWeek(response.data.data)
            }catch(error){
                console.log('topWeek 불러오기 실패',error);
            }
        }
        fetchTopWeek()
    },[])

    console.log('밈들:',topView)
    return(
        <div className="topmeme">
            <div className="topmeme-view">
                <MemeSlider title="Top Viewed Memes" memes={topView}/>
                <MemeSlider title="Top Liked Memes" memes={topLike} />
                <MemeSlider title="Top Memes This Week" memes={topWeek} />
            </div>
            <div className="topmeme-like">

            </div>
            <div className="topmeme-thisweek">

            </div>
        </div>
    )
}
export default TopMeme;