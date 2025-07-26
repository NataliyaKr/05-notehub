import { useState } from "react";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm.tsx/NoteForm";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalNumberOfPages={totalPages}
            currentActivePage={currentPage}
            setPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : (
        <NoteList notes={data?.notes ?? []} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;
