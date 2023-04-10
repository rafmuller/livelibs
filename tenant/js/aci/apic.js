function classQuery(classname) {
	return $.ajax({
		url: 'http://' + $.cookie('apic_ip') + '/api/node/class/' + classname + '.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function buildTableData(aci_endpoint_data) {
	table_data = [];
	regex = /tn-(\w*)\/ap-(\w*)\/epg-(\w*)\/cep-(\w*:\w*:\w*:\w*:\w*:\w*)/
	$.each(aci_endpoint_data['imdata'], function (i, endpoint) {
		var line_dn = regex.exec(endpoint.fvCEp.attributes.dn)
		if (line_dn) {
			var tenant = line_dn[1]
			var app_profile = line_dn[2]
			var epg = line_dn[3]
			row = [endpoint.fvCEp.attributes.mac, tenant, app_profile, epg];
			table_data.push(row);
		}
	});
	return table_data;
}

function get_fabric_node_data() {
	return $.ajax({
		url: 'http://' +
			$.cookie('apic_ip') +
			'/api/node/class/dhcpClient.json?query-target-filter=and(not(wcard(dhcpClient.dn,%22__ui_%22)),and(and(ne(dhcpClient.nodeId,"0"),ne(dhcpClient.ip,"0.0.0.0")),or(eq(dhcpClient.nodeRole,"spine"),eq(dhcpClient.nodeRole,"leaf"))))',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function proc_fabric_node_data(fabric_data) {
	table_data = [];
	$.each(fabric_data['imdata'], function (i, device) {
		table_row = [
			device.dhcpClient.attributes.name,
			device.dhcpClient.attributes.id,
			device.dhcpClient.attributes.nodeId,
			device.dhcpClient.attributes.model,
			device.dhcpClient.attributes.runningVer
		];
		table_data.push(table_row);
	});
	return table_data;
}

function proc_fabric_leaf_list(fabric_data) {
	table_data = [];
	$.each(fabric_data['imdata'], function (i, device) {
		if (device.dhcpClient.attributes.clientEvent == 'assigned' &&
			device.dhcpClient.attributes.nodeRole == 'leaf') {
			table_row = [
				device.dhcpClient.attributes.name,
				device.dhcpClient.attributes.id,
			];
			table_data.push(table_row);
		}
	});
	return table_data;
}


function get_fabric_health_data() {
	return $.ajax({
		url: 'http://' + $.cookie('apic_ip') + '/api/node/mo/topology/health.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function get_fabric_health(health_data) {
	return health_data.imdata[0].fabricHealthTotal.attributes.cur;
}

function get_fabric_fault_data() {
	return $.ajax({
		url: 'http://' + $.cookie('apic_ip') + '/api/class/faultCountsWithDetails.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function process_fabric_fault_data(fabric_fault_data) {
	fault_obj = {
		"crit": fabric_fault_data["imdata"][0]["faultCountsWithDetails"]["attributes"]["crit"],
		"maj": fabric_fault_data["imdata"][0]["faultCountsWithDetails"]["attributes"]["maj"],
		"min": fabric_fault_data["imdata"][0]["faultCountsWithDetails"]["attributes"]["minor"],
		"warn": fabric_fault_data["imdata"][0]["faultCountsWithDetails"]["attributes"]["warn"]
	}
	return fault_obj;
}

function get_fabric_tenants() {
	return $.ajax({
		url: 'http://' + $.cookie('apic_ip') + '/api/class/fvTenant.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function get_fabric_dashenpoints() {
	return $.ajax({
		url: 'http://' + $.cookie('apic_ip') + '/api/class/fvCEp.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}