import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import '../styles/common.css';

function FindMemeEdit() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [editorValue, setEditorValue] = useState('');
    const [title, setTitle] = useState('');
    const quillRef = useRef(null);
    console.log(state);
    useEffect(() => {
        if (state && state.post) {
            setEditorValue(state.post.htmlContent || '');
            setTitle(state.post.title || '');
        }
    }, [state]);

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

        const plainText = quillRef.current.getEditor().getText();
        console.log("id : ",state.post.id)
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/find-posts/${state.post.id}`, {
                title: title,
                htmlContent: editorValue,
                content: plainText
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                navigate(`/findmeme/${state.post.id}`);
            }

        } catch (error) {
            console.error('Error updating post:', error);
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
        <div className="findMemeEdit">
            <h2>글 수정</h2>
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
                <button className="findMemeEdit-btn" type="submit">수정 완료</button>
            </form>
        </div>
    );
}

export default FindMemeEdit;
