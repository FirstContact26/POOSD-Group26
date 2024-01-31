<?php
    $inData = getRequestInfo();

    $login = $inData["login"]; // Assuming login is used to identify the user
    $contactId = $inData["contactId"]; // Assuming contactId is used to identify the contact

    $conn = new mysqli("localhost", "DBUser", "password", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        // Fetching the user ID based on the login
        $stmt_user = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
        $stmt_user->bind_param("s", $login);
        $stmt_user->execute();
        $result_user = $stmt_user->get_result();

        if ($row_user = $result_user->fetch_assoc()) {
            $userId = $row_user['ID'];

            $stmt_delete = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND ID = ?");
            $stmt_delete->bind_param("ii", $userId, $contactId);
            $stmt_delete->execute();

            if ($stmt_delete->affected_rows > 0) {
                $stmt_delete->close();
                $stmt_user->close();
                $conn->close();
                returnWithError("");
            } else {
                $stmt_delete->close();
                $stmt_user->close();
                $conn->close();
                returnWithError("Contact not found or you don't have permission to delete it");
            }
        } else {
            $stmt_user->close();
            $conn->close();
            returnWithError("User not found");
        }
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
