function apic_get_token(ip, username, password) {
	return $.ajax({
		type : 'POST',
		url  : 'https://' + ip + '/api/aaaLogin.json?gui-token-request=yes',
		data : JSON.stringify({
			aaaUser : {
				attributes : {
					name : username,
					pwd  : password
				}
			}
		})
	});
}
