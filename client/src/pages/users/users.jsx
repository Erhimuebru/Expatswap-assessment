import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { apiGet } from "../../utils/api";
import "./users.css";
import Loading from "../../components/loading/loading";

const Users = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(5);
  const [startDOB, setStartDOB] = useState("");
  const [endDOB, setEndDOB] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiGet("/users/all");
        setPostData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredUsers = postData.filter((user) => {
    if (!startDOB && !endDOB) return true;
    if (startDOB && !endDOB) return new Date(user.dob) >= new Date(startDOB);
    if (!startDOB && endDOB) return new Date(user.dob) <= new Date(endDOB);
    return (
      new Date(user.dob) >= new Date(startDOB) &&
      new Date(user.dob) <= new Date(endDOB)
    );
  });

  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

  const handleClearFilters = () => {
    setStartDOB("");
    setEndDOB("");
  };


  

  if (loading) {
    return (
      <div className="-mt-44">
        <Loading />
      </div>
    );
  }

  return (
    <div className="items-center justify-center">
      <div className="mt-6 ml-6 mr-6">
        <p className="text-gray-500 capitalize mb-3">
          Select range of date of birth
        </p>
        <div className="flex gap-4">
          <div className="mb-4">
            <label
              htmlFor="startDOB"
              className="block font-semibold text-gray-800 text-sm"
            >
              Start Date of Birth
            </label>
            <input
              type="date"
              id="startDOB"
              name="startDOB"
              className="mt-1 p-2 border rounded w-44"
              value={startDOB}
              onChange={(e) => setStartDOB(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="endDOB"
              className="block font-semibold text-gray-800 text-sm"
            >
              End Date of Birth
            </label>
            <input
              type="date"
              id="endDOB"
              name="endDOB"
              className="mt-1 p-2 border rounded w-44"
              value={endDOB}
              onChange={(e) => setEndDOB(e.target.value)}
            />
          </div>
        </div>
        {startDOB || endDOB ? (
          <>
            <div className="flex items-center justify-center">
              <div>
                <p className="text-center ">
                  Number of users found: {filteredUsers.length}
                </p>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-6 mt-2 rounded"
                  onClick={handleClearFilters}
                >
                  Clear Results
                </button>
              </div>
            </div>
          </>
        ) : null}
        {currentPosts.length > 0 ? (
          <div>
            <table className="min-w-full divide-y divide-gray-200 mt-3">
              <thead className="bg-gray-50 ">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    S/N
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date of Birth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 mt-2 py-4 border">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-center border capitalize">
                      {user.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-center border capitalize">
                      {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-center border ">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-center border">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-center border">
                   
                      {new Date(user.dob).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-red-500 mt-20">
            No users found based on the specified date of birth range.
          </p>
        )}
      </div>
      <div className="mt-8 mb-2">
        <ReactPaginate
          pageCount={Math.ceil(filteredUsers.length / postsPerPage)}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          previousLabel={"Prev"}
          nextLabel={"Next"}
          breakLabel={"..."}
          previousClassName={"pagination-button"}
          nextClassName={"pagination-button"}
          breakClassName={"pagination-break"}
          pageClassName={"pagination-page"}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </div>
    </div>
  );
};

export default Users;
