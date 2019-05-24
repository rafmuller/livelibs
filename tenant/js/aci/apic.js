function classQuery(classname) {
	return $.ajax({
		url: 'https://' + $.cookie('apic_ip') + '/api/node/class/' + classname + '.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function buildTableData(aci_endpoint_data) {
	table_data = [];
	$.each(aci_endpoint_data['imdata'], function (i, endpoint) {
		tenant_regex = /tn-([a-zA-Z0-9_.-]*)/;
		fvCEpdn = endpoint.fvCEp.attributes.dn;
		row = [endpoint.fvCEp.attributes.mac, endpoint.fvCEp.attributes.ip, fvCEpdn.match(tenant_regex)[1]];
		table_data.push(row);
	});
	return table_data;
}

function get_fabric_node_data() {
	return $.ajax({
		url: 'https://' +
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
		if (device.dhcpClient.attributes.clientEvent == 'assigned') {
			table_row = [
				device.dhcpClient.attributes.name,
				device.dhcpClient.attributes.id,
				device.dhcpClient.attributes.nodeId,
				device.dhcpClient.attributes.model,
				device.dhcpClient.attributes.runningVer
			];
			table_data.push(table_row);
		}
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
		url: 'https://' + $.cookie('apic_ip') + '/api/node/mo/topology/HDfabricOverallHealth5min-0.json',
		headers: {
			DevCookie: $.cookie('token'),
			'APIC-challenge': $.cookie('urlToken'),
			'Content-Type': 'application/json'
		}
	});
}

function get_fabric_health(health_data) {
	return health_data.imdata[0].fabricOverallHealthHist5min.attributes.healthAvg;
}