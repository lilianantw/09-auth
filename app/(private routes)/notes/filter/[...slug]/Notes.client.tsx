"use client";

import React, { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getNotes, FetchNotesResponse } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";
import css from "./NotesPage.module.css";
import { Note } from "@/types/note";

interface NotesClientProps {
  initialNotes: Note[];
  initialTotalPages: number;
  selectedTag?: string;
}

export default function NotesClient({
  initialNotes,
  initialTotalPages,
  selectedTag,
}: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const hasTagFilter = selectedTag && selectedTag.toLowerCase() !== "all";
  const shouldFetch = Boolean(debouncedSearch || page !== 1 || hasTagFilter);

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch, hasTagFilter ? selectedTag : ""],
    queryFn: () =>
      getNotes({
        page,
        search: debouncedSearch,
        tag: hasTagFilter ? selectedTag : "",
      }),
    placeholderData: keepPreviousData,
    enabled: shouldFetch,
    staleTime: 10_000,
  });

  const displayedData = useMemo(() => {
    return shouldFetch
      ? data
      : { notes: initialNotes, totalPages: initialTotalPages };
  }, [shouldFetch, data, initialNotes, initialTotalPages]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {shouldFetch && isLoading && <p>Loading...</p>}

      {error && (
        <div className={css.error}>
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      )}

      {displayedData?.notes?.length ? (
        <>
          <NoteList notes={displayedData.notes} />
          {displayedData.totalPages > 1 && (
            <Pagination
              pageCount={displayedData.totalPages}
              onPageChange={handlePageChange}
              currentPage={page - 1}
            />
          )}
        </>
      ) : (
        !isLoading && <div className={css.noNotes}>No notes found</div>
      )}
    </div>
  );
}
