<?php


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    // Basic Validation (You can add more robust validation)
    if (empty($name) || empty($email) || empty($message)) {
        echo "Please fill in all fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
    } else {
        // Process the form data (e.g., send an email, store in database)

        // Example: Sending an email (replace with your email address)
        $to = "groundskirsten@yahoo.com";
        $subject = "New Message from Website";
        $body = "Name: " . $name . "\nEmail: " . $email . "\nMessage: " . $message;
        $headers = "From: " . $email;

        if (mail($to, $subject, $body, $headers)) {
            echo "Message sent successfully!";
        } else {
            echo "Failed to send message. Please try again later.";
        }

        
        $servername = "your_servername";
        $username = "your_username";
        $password = "your_password";
        $dbname = "your_dbname";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO messages (name, email, message) VALUES ('$name', '$email', '$message')";

        if ($conn->query($sql) === TRUE) {
            echo "Message stored in database.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();
        

    }
} else {
    echo "Invalid request."; // Prevents direct access to the PHP file
}
?>