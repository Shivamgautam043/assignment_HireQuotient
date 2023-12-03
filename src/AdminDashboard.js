import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import delete1 from "./img/delete1.png";
import deleteAll from "./img/deleteAll.png";
import save from "./img/save.png";
import next from "./img/next.png";
import previous from "./img/previous.png";
import edit from "./img/edit.png";
import lastPage from "./img/lastPage.png";
import firstPage from "./img/firstPage.png";


const AdminDashboard = ({
  setSelectedRows,
  allusers,
  setUsers,
  users,
  selectedRows,
  searchTerm,
  setSearchTerm,
  onSelectRow,
  onDeselectRow,
  ondeleteSelected,
  onPageChange,
  currentPage,
  itemsPerPage,
}) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedrole, setEditedrole] = useState("");
  const handleEdit = (rowId, initialName, initialEmail, initialrole) => {
    setEditableRowId(rowId);
    setEditedName(initialName);
    setEditedEmail(initialEmail);
    setEditedrole(initialrole);
  };
  // it will Save  edited name and email, then reset editableRowId
  const handleSave = (rowId) => {
    const updatedUsers = users.map((user) =>
      user.id === rowId
        ? { ...user, name: editedName, email: editedEmail, role: editedrole }
        : user
    );
    setUsers(updatedUsers);
    setEditableRowId(null);
  };
  const handledelete = (rowId) => {
    const updatedUsers = allusers.filter((user) => user.id !== rowId);
    setUsers(updatedUsers);
  };
  const handlePageChange = (page) => {
    setSelectedRows([]);
    onPageChange(page);
  };
  useEffect(() => {
    // Update the state of "Select All" checkbox when all rows on the current page are selected
    setSelectAllChecked(selectedRows.length === itemsPerPage);
  }, [selectedRows, itemsPerPage]);

  const handleSelectAll = async () => {
    const idsOnCurrentPage = users
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((user) => user.id);
    for (const rowId of idsOnCurrentPage) {
      if (selectAllChecked) {
        // Deselect the row if "Select All" is checked
        await onDeselectRow(rowId);
      } else {
        // Select the row if "Select All" is not checked
        if (!selectedRows.includes(rowId)) {
          await onSelectRow(rowId);
        }
      }
    }
    const updatedSelectedRows = selectAllChecked
      ? selectedRows.filter((rowId) => !idsOnCurrentPage.includes(rowId))
      : [...selectedRows, ...idsOnCurrentPage];

    setSelectAllChecked(!selectAllChecked);
    setSelectedRows(updatedSelectedRows);
    console.log(selectedRows);
  };

  const totalPages = Math.ceil(allusers.length / itemsPerPage);
  const buttons = [];
  for (let i = 1; i !== totalPages + 1; i++) {
    buttons.push(
      <button className="number-button"
        key={i}
        style={{
          borderRadius: "15%",
          width: "40px",
          height: "40px",
          backgroundColor: "#fff",
          color: "#000000",
          border: "1px solid #000000",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s, transform 0.2s",
        }}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div>
      {/* search holder with the search placeholder */}
      <input
        className="search-icon"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* all delete button */}
      <img
        src={deleteAll}
        style={{
          borderRadius: "15%",
          width: "40px",
          height: "40px",
          position: "absolute",
          top: 3,
          right: 67,
        }}
        onClick={ondeleteSelected}
        alt="dele"
      />

      {/* the main table field */}
      <table>
        <thead>
          <tr>
            <th>
              {/* checkbox for selecting all rows */}
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectAllChecked}
              />
              Select All
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  onChange={() => {
                    selectedRows.includes(user.id)
                      ? onDeselectRow(user.id)
                      : onSelectRow(user.id);
                  }}
                  checked={selectAllChecked || selectedRows.includes(user.id)}
                />
              </td>
              <td>
                {editableRowId === user.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editableRowId === user.id ? (
                  <input
                    type="text"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editableRowId === user.id ? (
                  <input
                    type="text"
                    value={editedrole}
                    onChange={(e) => setEditedrole(e.target.value)}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editableRowId === user.id ? (
                  <img
                    src={save}
                    style={{ cursor: "pointer", width: "30px", height: "30px" }}
                    alt="save"
                    onClick={() => handleSave(user.id)}
                  />
                ) : (
                  <>
                    <img
                      src={edit}
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                      alt="edit"
                      onClick={() =>
                        handleEdit(user.id, user.name, user.email, user.role)
                      }
                    />
                    <img
                      src={delete1}
                      style={{ width: "30px", height: "30px" }}
                      alt="del"
                      onClick={() => {
                        handledelete(user.id);
                      }}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom-line">

        <div>{selectedRows.length} of {allusers.length} rows selected</div>


        <div className="bottom-right">
        {/* footer */}
        <div style={{ position: "relative", marginTop: "20px" }}>
          <span style={{ bottom: "40px", right: "10px" }}>
            Current Page: {currentPage} of{" "}
            {Math.ceil(allusers.length / itemsPerPage)}
          </span>
        </div>

        {/* the botton navigation buttons */}
        <div className="bottom-button">
          <img
            src={firstPage}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "15%",
              cursor: "pointer",
            }}
            alt="firstPage"
            onClick={() => handlePageChange(1)}
          />

          <img
            src={previous}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "15%",
              cursor: "pointer",
            }}
            alt="previous"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {buttons}
          <img
            src={next}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "15%",
              cursor: "pointer",
            }}
            alt="nextPage"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(allusers.length / itemsPerPage)}
          />

          <img
            src={lastPage}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "15%",
              cursor: "pointer",
            }}
            alt="lastPage"
            onClick={() =>
              handlePageChange(Math.ceil(allusers.length / itemsPerPage))
            }
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
