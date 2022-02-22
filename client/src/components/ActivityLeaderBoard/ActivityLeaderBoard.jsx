import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useQuery } from '@apollo/client';
import { QUERY_SCORE_COUNT } from '../../utils/queries';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const ActivityLeaderBoard = () => {
    const { loading, data, refetch } = useQuery(QUERY_SCORE_COUNT);
    refetch();
    const leaderBoard = data?.users;

    function compare(a, b) {
        if (a.gameCount < b.gameCount) {
            return 1
        }
        if (a.gameCount > b.gameCount) {
            return -1;
        }
        return 0;
    }

    let tempArr = []
    if (data) {
        tempArr = data.users.slice().sort(compare)
    }

    function Items({ leaderBoard, page }) {
        return (
            <>
                {tempArr ? (
                    <tbody>
                        {tempArr.map((user, i) => (
                            <tr key={uuid()}>
                                <td className="text-center p-2" key={uuid()}>
                                    {i + 1}
                                </td>
                                <td className="text-center p-2" key={uuid()}>
                                    {user.gameCount}
                                </td>
                                <td className="text-center p-2" key={uuid()}>
                                    <Link
                                        to={`/profile/${user.username}`}
                                        className="text-gray-700 dark:text-gray-300 hover:text-theme-red dark:hover:text-theme-red transition-all duration-300"
                                    >
                                        {user.username}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody>
                        <tr>
                            <td className="text-center p-2">Loading...</td>
                        </tr>
                    </tbody>
                )}
            </>
        );
    }

    function PaginatedItems({ itemsPerPage }) {
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        const [itemOffset, setItemOffset] = useState(0);

        useEffect(() => {
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(leaderBoard.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(leaderBoard.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset =
                (event.selected * itemsPerPage) % leaderBoard.length;
            setItemOffset(newOffset);
        };

        return (
            <>
                <table className="table-auto mx-auto text-gray-600 dark:text-gray-400">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Games Played</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <Items leaderBoard={currentItems} page={itemOffset} />
                </table>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<<"
                    renderOnZeroPageCount={null}
                    className="m-auto w-1/3 flex p-2 justify-around pagination-nav"
                />
            </>
        );
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <section className="mx-auto my-4">
            <h1 className="block my-4 text-center text-2xl underline text-gray-600 dark:text-gray-300">
                Activity Leaderboard
            </h1>
            <PaginatedItems itemsPerPage={10} />
        </section>
    );
};

export default ActivityLeaderBoard;
