function login() {
	return $.ajax({
		type : 'POST',
		url  : creds.url + '/api/aaaLogin.json?gui-token-request=yes',
		data : JSON.stringify({
			aaaUser : {
				attributes : {
					name : creds.name,
					pwd  : creds.pwd
				}
			}
		})
	});
}
