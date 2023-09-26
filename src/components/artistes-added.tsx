'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import toast, {Toaster} from 'react-hot-toast';

export interface Artist {
  id: string;
  name: string;
}

enum LoadingState {
  Idle = 'Idle',
  Updating = 'Updating',
  Updated = 'Updated',
  Failed = 'Failed',
}

const initializeLoadingStates = (data: Artist[]) => {
  const loadingStates: {[key: string]: LoadingState} = {};
  data.forEach(artist => {
    loadingStates[artist.id] = LoadingState.Idle;
  });
  return loadingStates;
};

export default function ArtistesAdded({data}: {data: Artist[]}) {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: LoadingState;
  }>(initializeLoadingStates(data));

  const updateArtisteAlbums = async (artistId: string) => {
    try {
      setLoadingStates(prevLoadingStates => ({
        ...prevLoadingStates,
        [artistId]: LoadingState.Updating,
      }));

      const artist = data?.find(artiste => artiste.id === artistId);
      if (!artist) {
        return;
      }

      const artistNamesArray = [artist.name];

      const response = await fetch('/api/artistes', {
        method: 'POST',
        body: JSON.stringify({artistNames: artistNamesArray}),
      });

      if (response.ok) {
        setLoadingStates(prevLoadingStates => ({
          ...prevLoadingStates,
          [artistId]: LoadingState.Updated,
        }));
        toast.success(`Albums updated for ${artist.name}`);
      } else {
        setLoadingStates(prevLoadingStates => ({
          ...prevLoadingStates,
          [artistId]: LoadingState.Failed,
        }));
        toast.error(`Failed to update albums for ${artist.name}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setLoadingStates(prevLoadingStates => ({
        ...prevLoadingStates,
        [artistId]: LoadingState.Failed,
      }));
      toast.error(`Failed to update albums.`);
    } finally {
      setTimeout(() => {
        setLoadingStates(prevLoadingStates => ({
          ...prevLoadingStates,
          [artistId]: LoadingState.Idle,
        }));
      }, 2000);
    }
    router.refresh();
  };

  return (
    <div>
      <Toaster />
      <ul className="mt-4 flex flex-col gap-3">
        {data?.map(artiste => (
          <li key={artiste.id} className="flex items-end justify-between">
            <p className="text-grey font-semibold">{artiste.name}</p>
            <button
              onClick={() => updateArtisteAlbums(artiste.id)}
              className="text-blue-800 text-sm font-bold"
              disabled={
                loadingStates[artiste.id] === LoadingState.Updating ||
                loadingStates[artiste.id] === LoadingState.Updated
              }
            >
              {loadingStates[artiste.id] === LoadingState.Updating
                ? 'Updating...'
                : loadingStates[artiste.id] === LoadingState.Updated
                ? 'Updated'
                : loadingStates[artiste.id] === LoadingState.Failed
                ? 'Failed to update'
                : 'Update'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
