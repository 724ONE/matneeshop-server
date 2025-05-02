const PAGE_SIZE = 20;

function getOTP() {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateUniqueID(role, entryYear, count) {
  const yearLastTwoDigits = entryYear.toString().slice(-2);
  const memberID = `${role}${yearLastTwoDigits}${count
    .toString()
    .padStart(3, "0")}`;
  return memberID;
}

const getApprovedIDs = (array1, array2) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }
  const filteredArray = array1.filter((_id) => {
    const item = array2.find(
      (item) => item?._id?.toString() === _id?.toString()
    );
    return item && item.status === "Approved";
  });
  return filteredArray;
};

module.exports = {
  PAGE_SIZE,

  getOTP,
  generateUniqueID,
  getApprovedIDs,
};
