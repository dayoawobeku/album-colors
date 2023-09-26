'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import CreatableSelect from 'react-select/creatable';
import toast from 'react-hot-toast';
import {customStyles} from './custom-select';

interface OptionType {
  label: string;
  value: string;
}

enum LoadingState {
  Idle = 'Idle',
  Updating = 'Updating',
  Updated = 'Updated',
  Failed = 'Failed',
}

function ArtistForm() {
  const router = useRouter();
  const [currentArtistName, setCurrentArtistName] = useState('');
  const [artistNames, setArtistNames] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.Idle,
  );

  const handleSubmit = async (e: {preventDefault: () => void}) => {
    e.preventDefault();
    setLoadingState(LoadingState.Updating);

    try {
      const namesArray = artistNames.map(name => name.trim());

      const response = await fetch('/api/artistes', {
        method: 'POST',
        body: JSON.stringify({artistNames: namesArray}),
      });

      if (response.ok) {
        setLoadingState(LoadingState.Updated);
        toast.success('Data uploaded successfully!');
      } else {
        setLoadingState(LoadingState.Failed);
        toast.error('Error uploading data.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setLoadingState(LoadingState.Failed);
      toast.error(`Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setLoadingState(LoadingState.Idle);
      }, 2000);
      setArtistNames([]);
    }
    router.refresh();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (!currentArtistName) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const updatedArtistNames = [...artistNames, currentArtistName];
        setArtistNames(updatedArtistNames);

        setCurrentArtistName('');
        setLoadingState(LoadingState.Idle);
        event.preventDefault();
    }
  };

  const handleInputChange = (newValue: string) => {
    setCurrentArtistName(newValue);
  };

  return (
    <section className="pt-20 text-grey">
      <h2 className="text-2xl font-bold">Enter Artist Names</h2>
      <form className="mt-4" onSubmit={handleSubmit}>
        <CreatableSelect
          components={{
            DropdownIndicator: () => null,
          }}
          inputValue={currentArtistName}
          isClearable
          isMulti
          menuIsOpen={false}
          onChange={(newValue: unknown) => {
            if (Array.isArray(newValue)) {
              setArtistNames(newValue.map((name: OptionType) => name.value));
            }
          }}
          onInputChange={(value, {action}) => {
            if (action === 'input-change') {
              handleInputChange(value);
            }
          }}
          onKeyDown={handleKeyDown}
          value={artistNames.map((keyword, index) => ({
            label: keyword,
            value: keyword,
            key: `${keyword}-${index}`,
          }))}
          placeholder="Type artist names and press enter/tab to add"
          className="text-primary font-manrope font-light mt-2"
          classNamePrefix="react-select__multi"
          styles={customStyles}
          required
          aria-label="Enter artist names"
        />

        <button
          type="submit"
          disabled={loadingState === LoadingState.Updating}
          className="mt-6 w-full bg-gray-50 flex items-center justify-center gap-4 text-sm font-bold h-12 rounded transition-all duration-300 outline outline-1 outline-gray-300 hover:outline-gray-400 focus:outline-gray-400 active:bg-gray-100"
        >
          {loadingState === LoadingState.Updating && (
            <svg
              className="animate-spin h-5 w-5 text-grey-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span>
            {loadingState === LoadingState.Updating
              ? 'Generating...'
              : 'Generate Palettes'}
          </span>
        </button>
      </form>
    </section>
  );
}

export default ArtistForm;
