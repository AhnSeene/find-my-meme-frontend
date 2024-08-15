import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import '../styles/common.css'


function FindMemePost() {
    const [editorValue, setEditorValue] = useState('');
    const [title, setTitle] = useState('');
    const quillRef = useRef(null);
    const navigate = useNavigate();

    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:8080/api/v1/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            
                // const imageUrl = response.data.data.fileUrl; // 상대 URL 사용

                const imageUrl = `http://localhost:8080${response.data.data.fileUrl}`;
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', imageUrl);
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Plain text (content) 추출
        const plainText = quillRef.current.getEditor().getText();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/find-posts', {
                title: title,
                htmlContent: editorValue,
                content: plainText
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data);
            if(response.data.success) {
                navigate(`/findmeme/${response.data.data.id}`);
            }

        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: handleImageUpload,
            },
        },
        clipboard: {
            matchVisual: false,
        },
    }), []);

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <div className="findMemePost">
            <h2>새 글 작성</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={handleTitleChange}
                    required
                />
                <ReactQuill
                    ref={quillRef}
                    value={editorValue}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    placeholder="내용을 입력하세요"
                    className="custom-editor"
                />
                <button className="findMemePost-btn" type="submit">등록</button>
            </form>
        </div>
    );
}

export default FindMemePost;
