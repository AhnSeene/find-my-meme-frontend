import { useRef } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import '../styles/common.css';

function PostForm({ title, setTitle, editorValue, setEditorValue, handleSubmit, handleImageUpload }) {
    const quillRef = useRef(null);

    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
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
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
            />
            <ReactQuill
                ref={quillRef}
                value={editorValue}
                onChange={setEditorValue}
                modules={modules}
                formats={formats}
                placeholder="내용을 입력하세요"
                className="custom-editor"
            />
            <button className="findMemePost-btn" type="submit">제출</button>
        </form>
    );
}

export default PostForm;
