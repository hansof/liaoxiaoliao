import axios from 'axios'
const util = function () {
	this.setCookie = (name, value, isLocal, minutes) => {
		if (isLocal && window.localStorage) {
			localStorage.setItem(name, value);
		} else {
			sessionStorage.setItem(name, value);
		}
		if (minutes) {
			let values = encodeURIComponent(value);
			let cdata = name + "=" + values;
			let d = new Date();
			if (minutes > 0) {
				d.setMinutes(d.getMinutes() + minutes);
				cdata += "; expires=" + d.toGMTString();
			} else if (minutes < 0) {
				d.setTime(d.getTime() - 1000);
				cdata += "; expires=" + d.toGMTString();
			}
			cdata += "; path=/";
			document.cookie = cdata;
		}
	};
	this.getCookie = (name, isCookie) => {
		let value = "";
		if (isCookie) {
			let cArr = document.cookie.split(";");
			for (let i = 0; i < cArr.length; i++) {
				let param = cArr[i].split("=");
				if (param[0].trim() == name) {
					value = param[1];
					break;
				}
			}
			if (!value) {
				value = "";
			} else {
				value = decodeURIComponent(value);
			}
			return value;
		}
		value = sessionStorage.getItem(name);
		if (value && value != "" && value != "undefined") {
			return value;
		}
		if (window.localStorage) {
			value = localStorage.getItem(name) || "";
		} else {
			value = "";
		}
		return value;
	};
	this.removeCookie = (name) => {
		this.setCookie(name, "", true, -1);
		if (window.localStorage) {
			localStorage.removeItem(name);
		}
		sessionStorage.removeItem(name);
	};
	this.parse = (data) => {
		if (data == "") {
			return (new Function("return null"))();
		} else {
			return (new Function("return (" + data + ")"))();
		}
	};
	this.getUrlParam = (m) => {
		let reg = new RegExp("(^|&)" + m + "=([^(&|#)]*)((&|#)|$)");
		let r = window.location.href.split('?');
		r = r.length == 1 ? null : (r[1].match(reg)||(r.length >= 3&&r[2].match(reg)));
		if (!r||r == null) return "";
		return decodeURIComponent(r[2]);
	};
	this.androidOrIphone = () => {
		let system = window.navigator.userAgent.toLowerCase();
		if (system.indexOf("iphone") >= 0 || system.indexOf("ipad") >= 0 || system.indexOf("mac") >= 0 || system.indexOf("ipod") >= 0) {
			return false;
		}

		return true;
	};
	this.blackTs = (str) => {
		if (document.getElementById("blackDiv")) {
			document.getElementById("blackSpan").innerHTML = str;
		} else {
			let blackDiv = document.createElement("div");

			blackDiv.id = "blackDiv";
			blackDiv.className = "blackts";
			blackDiv.style.position = "fixed";
			blackDiv.style.left = "0";
			blackDiv.style.bottom = "20%";
			blackDiv.style.width = "100%";
			blackDiv.style.textAlign = "center";
			blackDiv.style.zIndex = "999999";

			let html = '<span id="blackSpan" style="background: rgba(42,45,50,.94);color: white;';
			html += 'border-radius: .1rem;font-size: 0.32rem;padding: .2rem .6rem;">';
			html += str + '</span>';
			blackDiv.innerHTML = html;

			document.getElementsByTagName("body")[0].appendChild(blackDiv);
		}
		let blackId;
		if (blackId && blackId != "") {
			clearTimeout(blackId);
		}
		blackId = setTimeout(() => {
			if (document.getElementById("blackDiv")) {
				document.getElementsByTagName("body")[0].removeChild(document.getElementById("blackDiv"));
			}
		}, 2000);
	};

	this.getVersion = (ver) => {
		let vers = ver.replace(/[.]/g, '');
		return Number(vers);
	};
	/** 
	 * ASCCII排序
	*/
	this.sort_ASCII = (obj) => {
		let arr = new Array();
		for (let i in obj) {
			if (JSON.stringify(obj[i]) != "" && obj[i] != "" || obj[i] == "0") {
				if (i != "images") { 
					arr.push(i);
				}
			}
		}
		let sortArr = arr.sort();
		let sortObj = {};
		for (let i in sortArr) {
			sortObj[sortArr[i]] = encodeURIComponent(obj[sortArr[i]]);
		}
		sortObj = JSON.stringify(sortObj).replace(/{|}|"/g, "")
		sortObj = sortObj.replace(/:/g, "=")
		sortObj = sortObj.replace(/,/g, "&")
		return sortObj;
	}
	this.pattern = (times, fmt) => {
		////date.pattern(123123123,"yyyy-MM-dd hh:mm:ss")
		let timeStr = new Date(times);
		let o = {
			"M+": timeStr.getMonth() + 1, //月份
			"d+": timeStr.getDate(), //日
			"h+": timeStr.getHours() % 12 == 0 ? 12 : timeStr.getHours() % 12, //小时
			"H+": timeStr.getHours(), //小时
			"m+": timeStr.getMinutes(), //分
			"s+": timeStr.getSeconds(), //秒
			"q+": Math.floor((timeStr.getMonth() + 3) / 3), //季度
			S: timeStr.getMilliseconds() //毫秒
		};
		let week = {
			"0": "/u65e5",
			"1": "/u4e00",
			"2": "/u4e8c",
			"3": "/u4e09",
			"4": "/u56db",
			"5": "/u4e94",
			"6": "/u516d"
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				(timeStr.getFullYear() + "").substr(4 - RegExp.$1.length)
			);
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				(RegExp.$1.length > 1
					? RegExp.$1.length > 2
						? "/u661f/u671f"
						: "/u5468"
					: "") + week[timeStr.getDay() + ""]
			);
		}
		for (let k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(
					RegExp.$1,
					RegExp.$1.length == 1
						? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length)
				);
			}
		}
		return fmt;
	}
	this.isWeiXin=()=>{
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
	}
}
export default new util();


