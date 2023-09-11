import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Vibrant from "node-vibrant";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getAccessToken } from "@/helpers/spotify";

interface Album {
  album_title: string;
  album_id: string;
  cover_image: string;
  release_date: string;
  palettes: string[];
}

async function getArtistIds(artistNames: string[], access_token: string) {
  const artistIds: string[] = [];
  for (const artistName of artistNames) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        artistName
      )}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const data = await response.json();
    const artistId = data?.artists?.items?.[0]?.id;
    if (artistId) {
      artistIds.push(artistId);
    }
  }
  return artistIds;
}

async function getAlbumsByArtistId(artistId: string, access_token: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.json();
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { access_token } = await getAccessToken();

    const { artistNames } = await request.json();

    const allArtistsData = [];

    for (const artistName of artistNames) {
      const artistIds = await getArtistIds([artistName], access_token);

      const allAlbums: Album[] = [];
      for (const artistId of artistIds) {
        const albums = await getAlbumsByArtistId(artistId, access_token);

        for (const album of albums.items) {
          try {
            if (!album.images || album.images.length === 0) {
              throw new Error("Album cover images are missing.");
            }

            const image = album.images[0].url;
            const palette = await Vibrant.from(image).getPalette();

            const colors = {
              vibrant: palette.Vibrant?.hex || "",
              lightVibrant: palette.LightVibrant?.hex || "",
              darkVibrant: palette.DarkVibrant?.hex || "",
              muted: palette.Muted?.hex || "",
              lightMuted: palette.LightMuted?.hex || "",
            };

            const albumEntry: Album = {
              album_title: album.name,
              album_id: album.id,
              cover_image: album.images[0]?.url || "",
              release_date: album.release_date,
              palettes: Object.values(colors),
            };

            allAlbums.push(albumEntry);
          } catch (error: unknown) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              console.error(
                `Error generating color palette for album ${album.id}: ${errorMessage}`
              );
            }
          }
        }
      }

      allArtistsData.push({
        updated_at: new Date().toISOString(),
        name: artistName,
        albums: allAlbums,
      });
    }

    const { error } = await supabase
      .from("artistes")
      .upsert(allArtistsData, { onConflict: "name" });

    if (error) {
      console.error("Error upserting data to Supabase:", error);
    }

    return NextResponse.json(
      { message: "Data upserted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Error upserting data to Supabase",
      },
      { status: 500 }
    );
  }
}
