<?php
    $inData = getRequestInfo();

    $login = $inData["login"];
    $contactId = $inData["contactId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "DBUser", "password", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt_user = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
        $stmt_user->bind_param("s", $login);
        $stmt_user->execute();
        $result_user = $stmt_user->get_result();

        if ($row_user = $result_user->fetch_assoc()) {
            $userId = $row_user['ID'];

            $stmt_update = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserID = ? AND ID = ?");
            $stmt_update->bind_param("ssssis", $firstName, $lastName, $phone, $email, $userId, $contactId);
            $stmt_update->execute();

            error_log("SQL query executed: " . $stmt_update->error);

            if ($stmt_update->affected_rows > 0) {
                $stmt_update->close();
                $stmt_user->close();
                $conn->close();
                returnWithError("");
            } else {
                error_log("Update failed: " . $stmt_update->error);
                $stmt_update->close();
                $stmt_user->close();
                $conn->close();
                returnWithError("Contact not found or you made no changes");
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