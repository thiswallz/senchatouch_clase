<?php
header('Content-disposition: attachment; filename=cotizacion.pdf');
header('Content-type: application/pdf');
readfile('cot.pdf');
?>
