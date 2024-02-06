<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = $_POST["userid"];
    $password = password_hash($_POST["pwd1"], PASSWORD_DEFAULT);
    $fullname = $_POST["fullname"];
    $email = $_POST["email"];
    $tel = $_POST["tel"];
    $level = $_POST["level"];

    $servername = "127.0.0.1";
    $username = "root";
    $password_db = "azby9245azby!";
    $dbname = "register";

    try {
        
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password_db);

       
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        
        $sql = "INSERT INTO users (userid, password, fullname, email, tel, level)
                VALUES (:userid, :password, :fullname, :email, :tel, :level)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':userid', $userid);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':fullname', $fullname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':tel', $tel);
        $stmt->bindParam(':level', $level);

        $stmt->execute();

        echo "사용자가 성공적으로 등록되었습니다.";
    } catch (PDOException $e) {
        echo "오류: " . $e->getMessage();
    }

    $conn = null;
}
?>
