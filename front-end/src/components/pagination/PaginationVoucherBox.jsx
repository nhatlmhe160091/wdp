/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { changePageNumber } from "../../redux/slice/voucherSlice";
const PaginationResBox = ({ numberOfPage }) => {
  const dispatch = useDispatch();

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // data.selected bắt đầu từ 0
    dispatch(changePageNumber(selectedPage));
  };

  return (
    <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
      <ReactPaginate
        previousLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        }
        nextLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        }
        breakLabel={"..."}
        pageCount={numberOfPage}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-end gap-1 text-xs font-medium"}
        linkClassName={
          "block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        } // Áp dụng cho thẻ `a`
        activeLinkClassName={
          "block size-8 rounded border-blue-600 bg-blue-600 text-white font-bold"
        } // CSS cho thẻ `a` đang active
        pageClassName={
          "block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        }
        previousClassName={
          "inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
        }
        nextClassName={
          "inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
        }
        breakClassName={
          "block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        }
        disabledClassName={"opacity-50 pointer-events-none"}
      />
    </div>
  );
};

export default PaginationResBox;