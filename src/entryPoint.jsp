<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="UTF-8"  isELIgnored ="false"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="java.io.*,java.util.*" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<%@ taglib prefix="snk" uri="/WEB-INF/tld/sankhyaUtil.tld" %>
<html>
	<head>
		<script type="text/javascript" src="/mge/js/util/Base64.js?v="></script>
		<script>
			//console.log("Aqui");

			let params = new URLSearchParams()
	        let data = `${param.params}`;
			let dataParsed = Base64.decode(data)

			new URLSearchParams(dataParsed).forEach((val,key) => {if(!params.get(key)){params.set(key,val)}});
			let tempString = ''
			params.forEach((val,key) => {tempString += key + '=' + val  + '&'});

			if(tempString.lastIndexOf('&')){
				tempString = tempString.slice(0,tempString.lastIndexOf('&'))
			}

			data = Base64.encode(tempString)

			let url = new URL(window.location.origin+'/mge/${BASE_FOLDER}src/index.html'+location.search.toString());
			url.searchParams.delete('entryPoint');
			url.searchParams.append('params',data);

			// debugger;

			location.replace(url);


		</script>

	</head>
	<body>
	</body>
</html>
