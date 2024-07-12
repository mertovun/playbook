import React from 'react';
import { BsFillBookmarksFill } from "react-icons/bs";
import { useControlBarStore } from '../stores/useControlBarStore';


const BookmarkBarControl: React.FC = () => {
  const { bookmarkSidebar, setBookmarkSidebar } = useControlBarStore();
  return (
    <div className="control-group">
      <button 
        onClick={() => setBookmarkSidebar(!bookmarkSidebar)} 
        className={bookmarkSidebar ? 'selected':''}
        >
        <BsFillBookmarksFill />
      </button>
    </div>
  );
};

export default BookmarkBarControl;
