<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $login = $inData["login"]; // Assuming login is used to identify the user

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

            $stmt_contact = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, UserID, Phone, Email) VALUES (?, ?, ?, ?, ?)");
            $stmt_contact->bind_param("ssiis", $firstName, $lastName, $userId, $phone, $email); // Assuming UserID is an integer, use "i" instead of "s"
            $stmt_contact->execute();
            $stmt_contact->close();

            $stmt_user->close();
            $conn->close();
            // returnWithResult($firstName, $lastName);
            returnWithError("");
        } else {
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

    // function returnWithResult($firstName, $lastName) {
    //     $retValue = '{"' . $firstName . '" " " "' . $lastName . '" " successfully added to Contacts!"}';
    // }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>