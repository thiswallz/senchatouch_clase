<?php
sleep(1);
$mysqli = new mysqli("localhost", "root", "admin1234", "senchaapp");
/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}
$fn = $_POST['fn'];
$response =  array();

if($fn == 'login'){
	$u = $_POST['user'];
	$p = $_POST['pwd'];
	if ($result = $mysqli->query("SELECT * FROM usuario where nombre = '{$u}' and password = '{$p}' ")) {
		if($result->num_rows>0){
			$response['success'] = true;
		}else{
			$response['success'] = false;
			$response['message'] = 'No existe usuario/contraseña';			
		}
	    $result->close();
	}	
}
if($fn == 'logoff'){
	$response['success'] = true;
}
//final response
echo json_encode($response); 

?>