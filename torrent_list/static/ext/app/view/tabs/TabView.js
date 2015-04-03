/**
 * Created by Konstantin on 03.04.2015.
 */
Ext.define('TorrentWatchList.view.tabs.TabView', {
    extend: 'Ext.tab.Panel',
    xtype: 'main-tabs',
    controller: 'tab-view',
    requires: [
        'TorrentWatchList.view.tabs.TableView'
    ],

/*
    width: 400,
    height: 300,
*/
    defaults: {
        bodyPadding: 5,
        scrollable: true
    },


/*    listeners: {
        scope: 'controller',
        tabchange: 'onTabChange'
    },*/

    initComponent: function() {
        this.callParent(arguments);
        var tabs = this;

        console.log('TabView.initComponent()');

        var tabMask = new Ext.LoadMask({
            msg: 'Please wait...',
            target: this.up()
        });
        tabMask.show();

        Ext.Ajax.request({
            url: '/hubs/',
            timeout: 20000,
            success: function(response){
                console.log("Successfully load data");
                var hubs = JSON.parse(response.responseText);
                var add_hub = function(hub) {
                    var s = '';
                    if (hub.new) s = ' <b> +' + hub.new + '</b>';
                    tabs.add({
                        title: hub.description + s,
                        html : hub.id + ' : ' + hub.description,
                        focusable: false
                    });
                }
                if (Array.isArray(hubs)) {
                    if (hubs.length > 1) {
                        tabs.add({
                            title: 'Все хабы',
                            items: [ {
                                xtype: 'container',
                                //layout: 'fit',
                                items: [{
                                    xtype: 'torrent-table-view'
                                }]
                            }]
                        });
                    }
                    hubs.forEach(add_hub);
                } else {
                    add_hub(hubs);
                }
                tabs.setActiveTab(tabs.items.getAt(0));
                tabMask.hide();
            },
            failure: function(conn, response, options, eOpts) {
                tabMask.hide();
                showError(conn.responseText);
            }
        });


    }
});