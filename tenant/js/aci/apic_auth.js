function apic_get_token() {
	return $.ajax({
		type: 'POST',
		url: 'https://' + $.cookie('apic_ip') + '/api/aaaLogin.json?gui-token-request=yes',
		data: JSON.stringify({
			aaaUser: {
				attributes: {
					name: $.cookie('apic_user'),
					pwd: $.cookie('apic_pass')
				}
			}
		})
	});
}

function set_apic_cookies(data) {
	$.cookie('havetoken', 'Y', {
		path: '/',
		expires: 1
	});
	$.cookie('token', data['imdata'][0]['aaaLogin']['attributes']['token'], {
		path: '/',
		expires: 1
	});
	$.cookie('urlToken', data['imdata'][0]['aaaLogin']['attributes']['urlToken'], {
		path: '/',
		expires: 1
	});
}

function logout_apic() {
	$.removeCookie('havetoken');
	$.removeCookie('token');
	$.removeCookie('urlToken');
	$.removeCookie('apic_ip');
	$.removeCookie('apic_user');
	$.removeCookie('apic_pass');
}
