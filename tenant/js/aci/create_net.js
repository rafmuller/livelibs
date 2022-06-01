function get_tenant_object(tenant) {
    return $.ajax({
        url: 'http://' + $.cookie('apic_ip') + '/api/mo/uni/tn-' + tenant + '.json?rsp-subtree=children',
        headers: {
            DevCookie: $.cookie('token'),
            'APIC-challenge': $.cookie('urlToken'),
            'Content-Type': 'application/json'
        }
    });
}

function get_tenant_bd(tenant) {
    return $.ajax({
        url: 'http://' + $.cookie('apic_ip') + '/api/node/class/fvBD.json?query-target-filter=and(wcard(fvBD.dn,"' + tenant + '"))&rsp-subtree=children',
        headers: {
            DevCookie: $.cookie('token'),
            'APIC-challenge': $.cookie('urlToken'),
            'Content-Type': 'application/json'
        }
    });
}

function proc_bd_data(bd_objects) {
    bd_list = []
    $.each(bd_objects.imdata, function (i, bd_object) {
        bd_name = bd_object.fvBD.attributes.name;
        $.each(bd_object.fvBD.children, function (x, bd_children) {
            if (Object.keys(bd_children).toString() == 'fvRsCtx') {
                vrf_regex = /ctx-([a-zA-Z0-9_.-]*)/
                bd_vrf = bd_children.fvRsCtx.attributes.tDn.match(vrf_regex)[1];
            }
            if (Object.keys(bd_children).toString() == 'fvRtBd') {
                epg_regex = /epg-([a-zA-Z0-9_.-]*)/;
                bd_epg = bd_children.fvRtBd.attributes.tDn.match(epg_regex)[1];
            }
            if (Object.keys(bd_children).toString() == 'fvSubnet') {
                bd_subnet = bd_children.fvSubnet.attributes.ip;
            }
        });
        bd_list.push([bd_vrf, bd_name, bd_subnet, bd_epg])
    });
    return bd_list;
}

function get_tenant_vrf(tenant) {
    return $.ajax({
        url: 'http://' + $.cookie('apic_ip') + '/api/node/class/fvCtx.json?query-target-filter=and(wcard(fvBD.dn,"' + tenant + '"))&rsp-subtree=children',
        headers: {
            DevCookie: $.cookie('token'),
            'APIC-challenge': $.cookie('urlToken'),
            'Content-Type': 'application/json'
        }
    });
}

function proc_vrf_data(vrf_objects) {
    vrf_list = []
    $.each(vrf_objects.imdata, function (i, vrf_object) {
        vrf_name = vrf_object.fvCtx.attributes.name;
        vrf_list.push([vrf_name])
    });
    return vrf_list;
}


function get_tenant_epg(tenant) {
    return $.ajax({
        url: 'http://' + $.cookie('apic_ip') + '/api/node/class/fvAEPg.json?query-target-filter=and(wcard(fvAEPg.dn,"' + tenant + '"))',
        headers: {
            DevCookie: $.cookie('token'),
            'APIC-challenge': $.cookie('urlToken'),
            'Content-Type': 'application/json'
        }
    });
}

function proc_epg_data(epg_objects) {
    epg_list = []
    $.each(epg_objects.imdata, function (i, epg_object) {
        epg_name = epg_object.fvAEPg.attributes.name;
        epg_list.push([epg_name])
    });
    return epg_list;
}

function get_tenant_ap(tenant) {
    return $.ajax({
        url: 'http://' + $.cookie('apic_ip') + '/api/node/class/fvAp.json?query-target-filter=and(wcard(fvAp.dn,"' + tenant + '"))&rsp-subtree=children',
        headers: {
            DevCookie: $.cookie('token'),
            'APIC-challenge': $.cookie('urlToken'),
            'Content-Type': 'application/json'
        }
    });
}

function proc_ap_data(ap_objects) {
    ap_list = []
    $.each(ap_objects.imdata, function (i, ap_object) {
        ap_name = ap_object.fvAp.attributes.name;
        ap_list.push([ap_name])
    });
    return ap_list;
}