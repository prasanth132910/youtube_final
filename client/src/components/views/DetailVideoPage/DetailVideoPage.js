import React, { useEffect,useRef, useState } from 'react'
import { List, Avatar, Row, Col,Button,Icon,Input } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';
function DetailVideoPage(props) {


    const videoId = props.match.params.videoId
    const [Video, setVideo] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const videoVariable = {
        videoId: videoId
    }

    
    useEffect(() => {

        axios.post('/api/video/getVideo', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.video)

                    setVideo(response.data.video)
                    localStorage.setItem('videoId',videoId)
                    axios.put('/api/video/views/'+videoId+'/'+response.data.video.views).then(
                        console.log("success")
                    )
                } else {
                    alert('Failed to get video Info')
                }
            })

        axios.post('/api/comment/getComments', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments',response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
            })

    }, [])

     console.log("test");
    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }
    const [copySuccess, setCopySuccess] = useState('');
    const textAreaRef = useRef(null);
  
      function copyToClipboard(e) {
          textAreaRef.current.select();
          document.execCommand('copy');
          e.target.focus();
          setCopySuccess('Link Copied!');
        };

    if (Video.writer) {
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>
                        <form >
                         <Input style={{visibility:'visible' ,position:'fixed', marginTop:'-100%'}}
                          ref={textAreaRef}
                           value={'http://localhost:3000/video/'+videoId}
                         />  
                         </form>
                        <List.Item
                         
                            actions={[
                                <div>
                            <Button type="primary" onClick={copyToClipboard}>Share <Icon type="share-alt" /></Button>
                            {copySuccess}
                            </div>,
                            <LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}   />,
                             <Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')} />]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                                title={<a href="https://ant.design">{Video.title}</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>
                        {localStorage.getItem('userId') != null &&
                        <Comments CommentLists={CommentLists} postId={Video._id} refreshFunction={updateComment} />
                          }
                    </div>
                </Col>
                <Col lg={6} xs={24}>

                    <SideVideo />

                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }


}

export default DetailVideoPage

