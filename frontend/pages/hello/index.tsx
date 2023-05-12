import axios from 'axios';
import { useState } from 'react';

function FileUploadForm() {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: any) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', file, fileName);

    try {
      const res = await axios.post('http://localhost:5000/api/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res)
      setFile('');
      setFileName('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
      {fileName && <p>Selected file: {fileName}</p>}
    </form>
  );
}

export default FileUploadForm;
