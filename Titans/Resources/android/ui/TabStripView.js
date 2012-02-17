var _ = require('/lib/underscore'),
	ui = require('/ui/components'),
	theme = require('/ui/theme');

function TabButton(id, text, icon, selected) {
	function tabWidth() {
		return Ti.Platform.displayCaps.platformWidth / 4;
	}
	
	var self = new ui.Component(Ti.UI.createView({
		width:tabWidth(),
		opacity:0.8,
		backgroundColor:(selected) ? '#444444' : 'transparent'
	}));
	self.id = id;
	
	self.add(new ui.ImageView(icon,{
		top:6,
		height:25
	}));
	
	self.add(new ui.Label(text,{
		text:text,
		color:'#fff',
		bottom:3,
		font: {
			fontSize:10
		}
	}));
	
	Ti.Gesture.addEventListener('orientationchange', function() {
		self.viewProxy.width = tabWidth();
	});
	
	self.addEventListener('click', function() {
		self.fireEvent('selected', {id:self.id});
	});
	
	self.toggle = function(tid) {
		self.set('backgroundColor', (tid === self.id) ? '#444444' : 'transparent');
	};
	
	return self;
}

function TabStripView() {
	var self = new ui.Component(Ti.UI.createView({
		height:50,
		layout:'horizontal',
		backgroundColor:'#121212'
	}));
	
	//create and add tabs
	var tabObjects = [],
		tabInfo = [{
		title:L('updates', 'Stream'),
		icon:'/images/tabs/chat_white.png',
		id:'stream'
	},{
		title:L('groups', 'Groups'),
		icon:'/images/tabs/group_white.png',
		id:'groups'
	},{
		title:L('events', 'Events'),
		icon:'/images/tabs/calendar_white.png',
		id:'events'
	},{
		title:L('leaders', 'Leaders'),
		icon:'/images/tabs/badge_white.png',
		id:'leaders'
	}];
	
	_.each(tabInfo, function(obj) {
		var tab = new TabButton(obj.id, obj.title, obj.icon, obj.id === 'stream');
		self.add(tab);
		tabObjects.push(tab);
		tab.addEventListener('selected', function(e) {
			_.each(tabObjects, function(t) {
				t.toggle(e.id);
			});
			
			//bubble up
			self.fireEvent('selected', e);
		});
	});
	
	//this sucks, need to do this more intelligently
	self.selectIndex = function(index) {
		var tabId;
		switch(index) {
			case 0:
				tabId = 'stream';
				break;
			case 1:
				tabId = 'groups';
				break;
			case 2:
				tabId = 'events';
				break;
			default:
				tabId = 'leaders';
				break;
		}
		
		_.each(tabObjects, function(t) {
			t.toggle(tabId);
		});
	};
	
	return self;
}

module.exports = TabStripView;