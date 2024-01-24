<?php

	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "DBUser", "password", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Check if the user with the same login already exists
		$stmt_check = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt_check->bind_param("s", $login);
		$stmt_check->execute();
		$result_check = $stmt_check->get_result();

		if ($result_check->fetch_assoc()) {
			returnWithError("User with this login already exists");
		} else {
			// Insert new user into the Users table
			$stmt_insert = $conn->prepare("INSERT INTO Users (firstName, lastName, Login, Password) VALUES (?, ?, ?, ?)");
			$stmt_insert->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt_insert->execute();
			$stmt_insert->close();

			// Retrieve the ID of the newly registered user
			$id = $conn->insert_id;

			returnWithInfo($firstName, $lastName, $id);
		}

		$stmt_check->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
