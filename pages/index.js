import Head from 'next/head';
import Image from 'next/image';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';

export default function Home() {
  const supabase = useSupabaseClient();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  async function handleSubmission() {
    //  const avatarFile = event.target.files[0]
    console.log(selectedFile.name);

    const { data, bucketError } = await supabase.storage.getBucket('images');

    console.log(data);

    const { error } = await supabase.storage
      .from('images')
      .upload(`sign/images/${selectedFile.name}`, selectedFile, {
        upsert: true,
      });

    if (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <input type='file' name='file' onChange={changeHandler} />
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{' '}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
}
