'use client';
import { useState, useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    listblob();
  }, []);

  async function listblob(){
    let listofblob = await fetch('/api/list',{
      method: 'GET',
    });
    let res = await listofblob.json();
    setList(res);
    setMainloading(false);
    console.log(res);
  }

  const [loading, setLoading] = useState(false);

  const [mainloading, setMainloading] = useState(true);

  const [blob, setBlob] = useState(null);

  const [list, setList] = useState(null);

  const [error, setError] = useState(false);

  const handleFileChange = async (event) => {
    event.preventDefault();

    const file = event.target[0].files[0];
    if (!file) return;

    setBlob(null)
    setLoading(true);

    let filter = list.filter((bl)=>bl.pathname === file.name);
    if(filter[0]){
      let url = filter[0].url;
      let res = await fetch('/api/deletelist',{
        method: 'POST',
        body: JSON.stringify({url})
      });
      res = await res.json();
      if(res.message == 'file deleted'){
        uploadfile(file);
      }else{
        setError(true);
        alert('Error: ' + res.message);
      }
    }else{
      uploadfile(file);
    }

    setLoading(false);
  };

  const uploadfile = async (file) => {
    try{
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const blob = await response.json();
      setBlob(blob);
      listblob();
    }catch(error){
      setError(true);
    };
  }

  function getBaseUrl() {
    return typeof window !== "undefined" ? window.location.origin : "";
  }

  return (
    <main className="relative w-min-screen h-min-screen text-white bg-black flex flex-col gap-y-12">
      <form
        id="form"
        encType="multipart/form-data"
        className="relative flex flex-col justify-center space-y-6 z-[2] p-3"
        onSubmit={handleFileChange}
      >
        <div className='flex flex-col gap-y-6'>
          <input type="file" name="file" id="file" className="w-auto" />
          <div className='flex flex-row gap-x-6 align-center'>
            <button type='submit' className={`w-32 h-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 font-medium rounded-lg text-sm text-center ${loading ? 'pointer-events-none' : ''}`}>Upload</button>
            <div className="rounded-xl bg-black text-sm font-semibold shadow-sm flex align-center">
              {(loading && !error && blob == null) && <span>Processing your file, please wait...</span>}
              {(!loading && !error && blob) && <span>Upload complete</span>}
              {(!loading && error && blob == null) && <span>Try Again</span>}
            </div>
          </div>
        </div>
      </form>

      <div className='list w-full h-full p-3'>
        {mainloading && <div></div>}
        {!mainloading && <div className="w-full overflow-x-auto bg-black dark:bg-neutral-700">
          <table className="w-full md:w-1/2 text-left text-sm">
            <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 border-t">
              <tr>
                <th scope="col" className="px-6 py-4 border-x dark:border-neutral-600">File Name</th>
                <th scope="col" className="px-6 py-4 border-x dark:border-neutral-600">URL</th>
                <th scope="col" className="px-6 py-4 border-x dark:border-neutral-600">Timestamp</th>
                <th scope="col" className="px-6 py-4 border-x dark:border-neutral-600">Vercel URL</th>
                <th scope="col" className="px-6 py-4 border-x dark:border-neutral-600">Delete</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((blob)=>{
                return <tr className="border-b dark:border-neutral-600" key={blob.url}>
                  <td className="px-6 py-4 border-x dark:border-neutral-600">{blob.pathname}</td>
                  <td className="px-6 py-4 border-x dark:border-neutral-600">{getBaseUrl() + '/@' + blob.pathname}</td>
                  <td className="px-6 py-4 border-x dark:border-neutral-600">{blob.uploadedAt}</td>
                  <td className="px-6 py-4 border-x dark:border-neutral-600">{blob.url}</td>
                  <td className="px-6 py-4 border-x dark:border-neutral-600">
                    <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={async(e)=>{
                      e.currentTarget.classList.add('pointer-events-none')
                      let url = blob.url;
                      let res = await fetch('/api/deletelist',{
                        method: 'POST',
                        body: JSON.stringify({url})
                      });
                      res = await res.json();
                      if(res.message == 'file deleted'){
                        listblob();
                      }else{
                        e.currentTarget.classList.remove('pointer-events-none')
                      }
                    }}>Delete</button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>}
      </div>
    </main>
  );
}