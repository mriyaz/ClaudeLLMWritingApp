import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import loadingIndicator from './loading.gif'
import ReactMarkdown from 'react-markdown';


function App() {

  interface Section {
    title: string,
    content: string
  }


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([{ title: '', content: '' }]);
  const [completion, setCompletion] = useState("")

  const handleSectionChange = (field: 'title' | 'content', value: string, index: number) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleAddSection = () => {
    const newSections = [...sections];
    newSections.push({ title: '', content: '' })
    setSections(newSections)
  }

  const handleSubmit = () => {
    if (sections.some(section => section.title === '' || section.content === '')) {
      setError('Please make sure all sections are filled.');
    } else {
      setIsLoading(true);
      setError('');
      const yourData = {
        title: title,
        sections: sections,
      }
      fetch('/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yourData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setCompletion(data.completion)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-3/4">
        <h1 className='font-bold text-2xl mb-6 text-center'>Write with Claude</h1>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <label htmlFor="title" className='text-sm font-semibold'>Title</label>
              <input id="title" type="text" className='border p-2 w-full' value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            {sections.map((v: Section, i: number) => (
              <div key={`section_${i}`} className='space-y-2'>
                <div className='flex gap-2'>
                  <label htmlFor={`section_${i}`} className='text-sm font-semibold'>Section: </label>
                  <input
                    id={`title_${i}`}
                    type="text"
                    className='border p-2 w-full'
                    value={v.title}
                    onChange={(event) => handleSectionChange('title', event.target.value, i)}
                  />
                </div>
                <textarea
                  id={`section_${i}`}
                  onChange={(event) => handleSectionChange('content', event.target.value, i)}
                  className='border p-2 w-full'
                  value={v.content}
                  cols={30}
                  rows={5}
                />
              </div>
            ))}
            <div className='flex w-full gap-2'>
              <div onClick={handleAddSection} className='flex hover:cursor-pointer w-8/12 bg-amber-700 items-center gap-2 rounded-sm px-2 py-1 text-sm text-slate-200'>
                <FontAwesomeIcon icon={faPlusCircle} />
                <p>Add new section.</p>
              </div>
              <div onClick={handleSubmit} className='bg-emerald-600 hover:cursor-pointer flex items-center gap-2 w-4/12 text-slate-200 text-sm rounded-sm py-3 px-2'>
                <FontAwesomeIcon icon={faStarOfLife} />
                <p>Brainstorm</p>
              </div>
            </div>
          </div>
          <div className='p-4 border text-sm border-gray-300 rounded-lg flex flex-col justify-center text-gray-600'>
            <div className='absolute flex'>
              {
                isLoading &&
                <img src={loadingIndicator} alt=" " className='z-10 w-28 self-center' />
              }
            </div>
            {!isLoading && completion ?
              <ReactMarkdown>{completion}</ReactMarkdown>
              :
              <ReactMarkdown>Get started with collaborative writing with Claude!</ReactMarkdown>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;