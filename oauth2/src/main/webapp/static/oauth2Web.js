(function() {
	var STK = (function() {
		var that = {};
		var errorList = [];
		that.inc = function(ns, undepended) {
			return true
		};
		that.register = function(ns, maker) {
			var NSList = ns.split(".");
			var step = that;
			var k = null;
			while (k = NSList.shift()) {
				if (NSList.length) {
					if (step[k] === undefined) {
						step[k] = {}
					}
					step = step[k]
				} else {
					if (step[k] === undefined) {
						try {
							step[k] = maker(that)
						} catch (exp) {
							errorList.push(exp)
						}
					}
				}
			}
		};
		that.regShort = function(sname, sfun) {
			if (that[sname] !== undefined) {
				throw "[" + sname + "] : short : has been register"
			}
			that[sname] = sfun
		};
		that.IE = /msie/i.test(navigator.userAgent);
		that.E = function(id) {
			if (typeof id === "string") {
				return document.getElementById(id)
			} else {
				return id
			}
		};
		that.C = function(tagName) {
			var dom;
			tagName = tagName.toUpperCase();
			if (tagName == "TEXT") {
				dom = document.createTextNode("")
			} else {
				if (tagName == "BUFFER") {
					dom = document.createDocumentFragment()
				} else {
					dom = document.createElement(tagName)
				}
			}
			return dom
		};
		that.log = function(str) {
			errorList.push("[" + ((new Date()).getTime() % 100000) + "]: " + str)
		};
		that.getErrorLogInformationList = function(n) {
			return errorList.splice(0, n || errorList.length)
		};
		return that
	})();
	$Import = STK.inc;
	STK.register("kit.dom.parseDOM", function($) {
		return function(list) {
			for (var a in list) {
				if (list[a] && (list[a].length == 1)) {
					list[a] = list[a][0]
				}
			}
			return list
		}
	});
	STK.register("core.arr.indexOf", function($) {
		return function(oElement, aSource) {
			if (aSource.indexOf) {
				return aSource.indexOf(oElement)
			}
			for (var i = 0, len = aSource.length; i < len; i++) {
				if (aSource[i] === oElement) {
					return i
				}
			}
			return -1
		}
	});
	STK.register("core.arr.inArray", function($) {
		return function(oElement, aSource) {
			return $.core.arr.indexOf(oElement, aSource) > -1
		}
	});
	STK.register("core.func.getType", function($) {
		return function(oObject) {
			var _t;
			return ((_t = typeof(oObject)) == "object" ? oObject == null && "null" || Object.prototype.toString.call(oObject).slice(8, -1) : _t).toLowerCase()
		}
	});
	STK.register("core.dom.sizzle", function($) {
		var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
			done = 0,
			toString = Object.prototype.toString,
			hasDuplicate = false,
			baseHasDuplicate = true;
		[0, 0].sort(function() {
			baseHasDuplicate = false;
			return 0
		});
		var Sizzle = function(selector, context, results, seed) {
				results = results || [];
				context = context || document;
				var origContext = context;
				if (context.nodeType !== 1 && context.nodeType !== 9) {
					return []
				}
				if (!selector || typeof selector !== "string") {
					return results
				}
				var parts = [],
					m, set, checkSet, extra, prune = true,
					contextXML = Sizzle.isXML(context),
					soFar = selector,
					ret, cur, pop, i;
				do {
					chunker.exec("");
					m = chunker.exec(soFar);
					if (m) {
						soFar = m[3];
						parts.push(m[1]);
						if (m[2]) {
							extra = m[3];
							break
						}
					}
				} while (m);
				if (parts.length > 1 && origPOS.exec(selector)) {
					if (parts.length === 2 && Expr.relative[parts[0]]) {
						set = posProcess(parts[0] + parts[1], context)
					} else {
						set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
						while (parts.length) {
							selector = parts.shift();
							if (Expr.relative[selector]) {
								selector += parts.shift()
							}
							set = posProcess(selector, set)
						}
					}
				} else {
					if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
						ret = Sizzle.find(parts.shift(), context, contextXML);
						context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0]
					}
					if (context) {
						ret = seed ? {
							expr: parts.pop(),
							set: makeArray(seed)
						} : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
						set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
						if (parts.length > 0) {
							checkSet = makeArray(set)
						} else {
							prune = false
						}
						while (parts.length) {
							cur = parts.pop();
							pop = cur;
							if (!Expr.relative[cur]) {
								cur = ""
							} else {
								pop = parts.pop()
							}
							if (pop == null) {
								pop = context
							}
							Expr.relative[cur](checkSet, pop, contextXML)
						}
					} else {
						checkSet = parts = []
					}
				}
				if (!checkSet) {
					checkSet = set
				}
				if (!checkSet) {
					Sizzle.error(cur || selector)
				}
				if (toString.call(checkSet) === "[object Array]") {
					if (!prune) {
						results.push.apply(results, checkSet)
					} else {
						if (context && context.nodeType === 1) {
							for (i = 0; checkSet[i] != null; i++) {
								if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
									results.push(set[i])
								}
							}
						} else {
							for (i = 0; checkSet[i] != null; i++) {
								if (checkSet[i] && checkSet[i].nodeType === 1) {
									results.push(set[i])
								}
							}
						}
					}
				} else {
					makeArray(checkSet, results)
				}
				if (extra) {
					Sizzle(extra, origContext, results, seed);
					Sizzle.uniqueSort(results)
				}
				return results
			};
		Sizzle.uniqueSort = function(results) {
			if (sortOrder) {
				hasDuplicate = baseHasDuplicate;
				results.sort(sortOrder);
				if (hasDuplicate) {
					for (var i = 1; i < results.length; i++) {
						if (results[i] === results[i - 1]) {
							results.splice(i--, 1)
						}
					}
				}
			}
			return results
		};
		Sizzle.matches = function(expr, set) {
			return Sizzle(expr, null, null, set)
		};
		Sizzle.find = function(expr, context, isXML) {
			var set;
			if (!expr) {
				return []
			}
			for (var i = 0, l = Expr.order.length; i < l; i++) {
				var type = Expr.order[i],
					match;
				if ((match = Expr.leftMatch[type].exec(expr))) {
					var left = match[1];
					match.splice(1, 1);
					if (left.substr(left.length - 1) !== "\\") {
						match[1] = (match[1] || "").replace(/\\/g, "");
						set = Expr.find[type](match, context, isXML);
						if (set != null) {
							expr = expr.replace(Expr.match[type], "");
							break
						}
					}
				}
			}
			if (!set) {
				set = context.getElementsByTagName("*")
			}
			return {
				set: set,
				expr: expr
			}
		};
		Sizzle.filter = function(expr, set, inplace, not) {
			var old = expr,
				result = [],
				curLoop = set,
				match, anyFound, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
			while (expr && set.length) {
				for (var type in Expr.filter) {
					if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
						var filter = Expr.filter[type],
							found, item, left = match[1];
						anyFound = false;
						match.splice(1, 1);
						if (left.substr(left.length - 1) === "\\") {
							continue
						}
						if (curLoop === result) {
							result = []
						}
						if (Expr.preFilter[type]) {
							match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
							if (!match) {
								anyFound = found = true
							} else {
								if (match === true) {
									continue
								}
							}
						}
						if (match) {
							for (var i = 0;
							(item = curLoop[i]) != null; i++) {
								if (item) {
									found = filter(item, match, i, curLoop);
									var pass = not ^ !! found;
									if (inplace && found != null) {
										if (pass) {
											anyFound = true
										} else {
											curLoop[i] = false
										}
									} else {
										if (pass) {
											result.push(item);
											anyFound = true
										}
									}
								}
							}
						}
						if (found !== undefined) {
							if (!inplace) {
								curLoop = result
							}
							expr = expr.replace(Expr.match[type], "");
							if (!anyFound) {
								return []
							}
							break
						}
					}
				}
				if (expr === old) {
					if (anyFound == null) {
						Sizzle.error(expr)
					} else {
						break
					}
				}
				old = expr
			}
			return curLoop
		};
		Sizzle.error = function(msg) {
			throw "Syntax error, unrecognized expression: " + msg
		};
		var Expr = {
			order: ["ID", "NAME", "TAG"],
			match: {
				ID: /#((?:[\wÀ-￿\-]|\\.)+)/,
				CLASS: /\.((?:[\wÀ-￿\-]|\\.)+)/,
				NAME: /\[name=['"]*((?:[\wÀ-￿\-]|\\.)+)['"]*\]/,
				ATTR: /\[\s*((?:[\wÀ-￿\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
				TAG: /^((?:[\wÀ-￿\*\-]|\\.)+)/,
				CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
				POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
				PSEUDO: /:((?:[\wÀ-￿\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
			},
			leftMatch: {},
			attrMap: {
				"class": "className",
				"for": "htmlFor"
			},
			attrHandle: {
				href: function(elem) {
					return elem.getAttribute("href")
				}
			},
			relative: {
				"+": function(checkSet, part) {
					var isPartStr = typeof part === "string",
						isTag = isPartStr && !/\W/.test(part),
						isPartStrNotTag = isPartStr && !isTag;
					if (isTag) {
						part = part.toLowerCase()
					}
					for (var i = 0, l = checkSet.length, elem; i < l; i++) {
						if ((elem = checkSet[i])) {
							while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
							checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part
						}
					}
					if (isPartStrNotTag) {
						Sizzle.filter(part, checkSet, true)
					}
				},
				">": function(checkSet, part) {
					var isPartStr = typeof part === "string",
						elem, i = 0,
						l = checkSet.length;
					if (isPartStr && !/\W/.test(part)) {
						part = part.toLowerCase();
						for (; i < l; i++) {
							elem = checkSet[i];
							if (elem) {
								var parent = elem.parentNode;
								checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false
							}
						}
					} else {
						for (; i < l; i++) {
							elem = checkSet[i];
							if (elem) {
								checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part
							}
						}
						if (isPartStr) {
							Sizzle.filter(part, checkSet, true)
						}
					}
				},
				"": function(checkSet, part, isXML) {
					var doneName = done++,
						checkFn = dirCheck,
						nodeCheck;
					if (typeof part === "string" && !/\W/.test(part)) {
						part = part.toLowerCase();
						nodeCheck = part;
						checkFn = dirNodeCheck
					}
					checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML)
				},
				"~": function(checkSet, part, isXML) {
					var doneName = done++,
						checkFn = dirCheck,
						nodeCheck;
					if (typeof part === "string" && !/\W/.test(part)) {
						part = part.toLowerCase();
						nodeCheck = part;
						checkFn = dirNodeCheck
					}
					checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML)
				}
			},
			find: {
				ID: function(match, context, isXML) {
					if (typeof context.getElementById !== "undefined" && !isXML) {
						var m = context.getElementById(match[1]);
						return m ? [m] : []
					}
				},
				NAME: function(match, context) {
					if (typeof context.getElementsByName !== "undefined") {
						var ret = [],
							results = context.getElementsByName(match[1]);
						for (var i = 0, l = results.length; i < l; i++) {
							if (results[i].getAttribute("name") === match[1]) {
								ret.push(results[i])
							}
						}
						return ret.length === 0 ? null : ret
					}
				},
				TAG: function(match, context) {
					return context.getElementsByTagName(match[1])
				}
			},
			preFilter: {
				CLASS: function(match, curLoop, inplace, result, not, isXML) {
					match = " " + match[1].replace(/\\/g, "") + " ";
					if (isXML) {
						return match
					}
					for (var i = 0, elem;
					(elem = curLoop[i]) != null; i++) {
						if (elem) {
							if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0)) {
								if (!inplace) {
									result.push(elem)
								}
							} else {
								if (inplace) {
									curLoop[i] = false
								}
							}
						}
					}
					return false
				},
				ID: function(match) {
					return match[1].replace(/\\/g, "")
				},
				TAG: function(match, curLoop) {
					return match[1].toLowerCase()
				},
				CHILD: function(match) {
					if (match[1] === "nth") {
						var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
						match[2] = (test[1] + (test[2] || 1)) - 0;
						match[3] = test[3] - 0
					}
					match[0] = done++;
					return match
				},
				ATTR: function(match, curLoop, inplace, result, not, isXML) {
					var name = match[1].replace(/\\/g, "");
					if (!isXML && Expr.attrMap[name]) {
						match[1] = Expr.attrMap[name]
					}
					if (match[2] === "~=") {
						match[4] = " " + match[4] + " "
					}
					return match
				},
				PSEUDO: function(match, curLoop, inplace, result, not) {
					if (match[1] === "not") {
						if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
							match[3] = Sizzle(match[3], null, null, curLoop)
						} else {
							var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
							if (!inplace) {
								result.push.apply(result, ret)
							}
							return false
						}
					} else {
						if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
							return true
						}
					}
					return match
				},
				POS: function(match) {
					match.unshift(true);
					return match
				}
			},
			filters: {
				enabled: function(elem) {
					return elem.disabled === false && elem.type !== "hidden"
				},
				disabled: function(elem) {
					return elem.disabled === true
				},
				checked: function(elem) {
					return elem.checked === true
				},
				selected: function(elem) {
					elem.parentNode.selectedIndex;
					return elem.selected === true
				},
				parent: function(elem) {
					return !!elem.firstChild
				},
				empty: function(elem) {
					return !elem.firstChild
				},
				has: function(elem, i, match) {
					return !!Sizzle(match[3], elem).length
				},
				header: function(elem) {
					return (/h\d/i).test(elem.nodeName)
				},
				text: function(elem) {
					return "text" === elem.type
				},
				radio: function(elem) {
					return "radio" === elem.type
				},
				checkbox: function(elem) {
					return "checkbox" === elem.type
				},
				file: function(elem) {
					return "file" === elem.type
				},
				password: function(elem) {
					return "password" === elem.type
				},
				submit: function(elem) {
					return "submit" === elem.type
				},
				image: function(elem) {
					return "image" === elem.type
				},
				reset: function(elem) {
					return "reset" === elem.type
				},
				button: function(elem) {
					return "button" === elem.type || elem.nodeName.toLowerCase() === "button"
				},
				input: function(elem) {
					return (/input|select|textarea|button/i).test(elem.nodeName)
				}
			},
			setFilters: {
				first: function(elem, i) {
					return i === 0
				},
				last: function(elem, i, match, array) {
					return i === array.length - 1
				},
				even: function(elem, i) {
					return i % 2 === 0
				},
				odd: function(elem, i) {
					return i % 2 === 1
				},
				lt: function(elem, i, match) {
					return i < match[3] - 0
				},
				gt: function(elem, i, match) {
					return i > match[3] - 0
				},
				nth: function(elem, i, match) {
					return match[3] - 0 === i
				},
				eq: function(elem, i, match) {
					return match[3] - 0 === i
				}
			},
			filter: {
				PSEUDO: function(elem, match, i, array) {
					var name = match[1],
						filter = Expr.filters[name];
					if (filter) {
						return filter(elem, i, match, array)
					} else {
						if (name === "contains") {
							return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0
						} else {
							if (name === "not") {
								var not = match[3];
								for (var j = 0, l = not.length; j < l; j++) {
									if (not[j] === elem) {
										return false
									}
								}
								return true
							} else {
								Sizzle.error("Syntax error, unrecognized expression: " + name)
							}
						}
					}
				},
				CHILD: function(elem, match) {
					var type = match[1],
						node = elem;
					switch (type) {
					case "only":
					case "first":
						while ((node = node.previousSibling)) {
							if (node.nodeType === 1) {
								return false
							}
						}
						if (type === "first") {
							return true
						}
						node = elem;
					case "last":
						while ((node = node.nextSibling)) {
							if (node.nodeType === 1) {
								return false
							}
						}
						return true;
					case "nth":
						var first = match[2],
							last = match[3];
						if (first === 1 && last === 0) {
							return true
						}
						var doneName = match[0],
							parent = elem.parentNode;
						if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
							var count = 0;
							for (node = parent.firstChild; node; node = node.nextSibling) {
								if (node.nodeType === 1) {
									node.nodeIndex = ++count
								}
							}
							parent.sizcache = doneName
						}
						var diff = elem.nodeIndex - last;
						if (first === 0) {
							return diff === 0
						} else {
							return (diff % first === 0 && diff / first >= 0)
						}
					}
				},
				ID: function(elem, match) {
					return elem.nodeType === 1 && elem.getAttribute("id") === match
				},
				TAG: function(elem, match) {
					return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match
				},
				CLASS: function(elem, match) {
					return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1
				},
				ATTR: function(elem, match) {
					var name = match[1],
						result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
						value = result + "",
						type = match[2],
						check = match[4];
					return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false
				},
				POS: function(elem, match, i, array) {
					var name = match[2],
						filter = Expr.setFilters[name];
					if (filter) {
						return filter(elem, i, match, array)
					}
				}
			}
		};
		Sizzle.selectors = Expr;
		var origPOS = Expr.match.POS,
			fescape = function(all, num) {
				return "\\" + (num - 0 + 1)
			};
		for (var type in Expr.match) {
			Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
			Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape))
		}
		var makeArray = function(array, results) {
				array = Array.prototype.slice.call(array, 0);
				if (results) {
					results.push.apply(results, array);
					return results
				}
				return array
			};
		try {
			Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType
		} catch (e) {
			makeArray = function(array, results) {
				var ret = results || [],
					i = 0;
				if (toString.call(array) === "[object Array]") {
					Array.prototype.push.apply(ret, array)
				} else {
					if (typeof array.length === "number") {
						for (var l = array.length; i < l; i++) {
							ret.push(array[i])
						}
					} else {
						for (; array[i]; i++) {
							ret.push(array[i])
						}
					}
				}
				return ret
			}
		}
		var sortOrder;
		if (document.documentElement.compareDocumentPosition) {
			sortOrder = function(a, b) {
				if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
					if (a == b) {
						hasDuplicate = true
					}
					return a.compareDocumentPosition ? -1 : 1
				}
				var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
				if (ret === 0) {
					hasDuplicate = true
				}
				return ret
			}
		} else {
			if ("sourceIndex" in document.documentElement) {
				sortOrder = function(a, b) {
					if (!a.sourceIndex || !b.sourceIndex) {
						if (a == b) {
							hasDuplicate = true
						}
						return a.sourceIndex ? -1 : 1
					}
					var ret = a.sourceIndex - b.sourceIndex;
					if (ret === 0) {
						hasDuplicate = true
					}
					return ret
				}
			} else {
				if (document.createRange) {
					sortOrder = function(a, b) {
						if (!a.ownerDocument || !b.ownerDocument) {
							if (a == b) {
								hasDuplicate = true
							}
							return a.ownerDocument ? -1 : 1
						}
						var aRange = a.ownerDocument.createRange(),
							bRange = b.ownerDocument.createRange();
						aRange.setStart(a, 0);
						aRange.setEnd(a, 0);
						bRange.setStart(b, 0);
						bRange.setEnd(b, 0);
						var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
						if (ret === 0) {
							hasDuplicate = true
						}
						return ret
					}
				}
			}
		}
		Sizzle.getText = function(elems) {
			var ret = "",
				elem;
			for (var i = 0; elems[i]; i++) {
				elem = elems[i];
				if (elem.nodeType === 3 || elem.nodeType === 4) {
					ret += elem.nodeValue
				} else {
					if (elem.nodeType !== 8) {
						ret += Sizzle.getText(elem.childNodes)
					}
				}
			}
			return ret
		};
		(function() {
			var form = document.createElement("div"),
				id = "script" + (new Date()).getTime();
			form.innerHTML = "<a name='" + id + "'/>";
			var root = document.documentElement;
			root.insertBefore(form, root.firstChild);
			if (document.getElementById(id)) {
				Expr.find.ID = function(match, context, isXML) {
					if (typeof context.getElementById !== "undefined" && !isXML) {
						var m = context.getElementById(match[1]);
						return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : []
					}
				};
				Expr.filter.ID = function(elem, match) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
					return elem.nodeType === 1 && node && node.nodeValue === match
				}
			}
			root.removeChild(form);
			root = form = null
		})();
		(function() {
			var div = document.createElement("div");
			div.appendChild(document.createComment(""));
			if (div.getElementsByTagName("*").length > 0) {
				Expr.find.TAG = function(match, context) {
					var results = context.getElementsByTagName(match[1]);
					if (match[1] === "*") {
						var tmp = [];
						for (var i = 0; results[i]; i++) {
							if (results[i].nodeType === 1) {
								tmp.push(results[i])
							}
						}
						results = tmp
					}
					return results
				}
			}
			div.innerHTML = "<a href='#'></a>";
			if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
				Expr.attrHandle.href = function(elem) {
					return elem.getAttribute("href", 2)
				}
			}
			div = null
		})();
		if (document.querySelectorAll) {
			(function() {
				var oldSizzle = Sizzle,
					div = document.createElement("div");
				div.innerHTML = "<p class='TEST'></p>";
				if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
					return
				}
				Sizzle = function(query, context, extra, seed) {
					context = context || document;
					if (!seed && context.nodeType === 9 && !Sizzle.isXML(context)) {
						try {
							return makeArray(context.querySelectorAll(query), extra)
						} catch (e) {}
					}
					return oldSizzle(query, context, extra, seed)
				};
				for (var prop in oldSizzle) {
					Sizzle[prop] = oldSizzle[prop]
				}
				div = null
			})()
		}(function() {
			var div = document.createElement("div");
			div.innerHTML = "<div class='test e'></div><div class='test'></div>";
			if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
				return
			}
			div.lastChild.className = "e";
			if (div.getElementsByClassName("e").length === 1) {
				return
			}
			Expr.order.splice(1, 0, "CLASS");
			Expr.find.CLASS = function(match, context, isXML) {
				if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
					return context.getElementsByClassName(match[1])
				}
			};
			div = null
		})();

		function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
			for (var i = 0, l = checkSet.length; i < l; i++) {
				var elem = checkSet[i];
				if (elem) {
					elem = elem[dir];
					var match = false;
					while (elem) {
						if (elem.sizcache === doneName) {
							match = checkSet[elem.sizset];
							break
						}
						if (elem.nodeType === 1 && !isXML) {
							elem.sizcache = doneName;
							elem.sizset = i
						}
						if (elem.nodeName.toLowerCase() === cur) {
							match = elem;
							break
						}
						elem = elem[dir]
					}
					checkSet[i] = match
				}
			}
		}
		function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
			for (var i = 0, l = checkSet.length; i < l; i++) {
				var elem = checkSet[i];
				if (elem) {
					elem = elem[dir];
					var match = false;
					while (elem) {
						if (elem.sizcache === doneName) {
							match = checkSet[elem.sizset];
							break
						}
						if (elem.nodeType === 1) {
							if (!isXML) {
								elem.sizcache = doneName;
								elem.sizset = i
							}
							if (typeof cur !== "string") {
								if (elem === cur) {
									match = true;
									break
								}
							} else {
								if (Sizzle.filter(cur, [elem]).length > 0) {
									match = elem;
									break
								}
							}
						}
						elem = elem[dir]
					}
					checkSet[i] = match
				}
			}
		}
		Sizzle.contains = document.compareDocumentPosition ?
		function(a, b) {
			return !!(a.compareDocumentPosition(b) & 16)
		} : function(a, b) {
			return a !== b && (a.contains ? a.contains(b) : true)
		};
		Sizzle.isXML = function(elem) {
			var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false
		};
		var posProcess = function(selector, context) {
				var tmpSet = [],
					later = "",
					match, root = context.nodeType ? [context] : context;
				while ((match = Expr.match.PSEUDO.exec(selector))) {
					later += match[0];
					selector = selector.replace(Expr.match.PSEUDO, "")
				}
				selector = Expr.relative[selector] ? selector + "*" : selector;
				for (var i = 0, l = root.length; i < l; i++) {
					Sizzle(selector, root[i], tmpSet)
				}
				return Sizzle.filter(later, tmpSet)
			};
		return Sizzle
	});
	STK.register("core.dom.builder", function($) {
		function autoDeploy(sHTML, oSelector) {
			if (oSelector) {
				return oSelector
			}
			var result, re = /\<(\w+)[^>]*\s+node-type\s*=\s*([\'\"])?(\w+)\2.*?>/g;
			var selectorList = {};
			var node, tag, selector;
			while ((result = re.exec(sHTML))) {
				tag = result[1];
				node = result[3];
				selector = tag + "[node-type=" + node + "]";
				selectorList[node] = selectorList[node] == null ? [] : selectorList[node];
				if (!$.core.arr.inArray(selector, selectorList[node])) {
					selectorList[node].push(tag + "[node-type=" + node + "]")
				}
			}
			return selectorList
		}
		return function(sHTML, oSelector) {
			var _isHTML = $.core.func.getType(sHTML) == "string";
			var selectorList = autoDeploy(_isHTML ? sHTML : sHTML.innerHTML, oSelector);
			var container = sHTML;
			if (_isHTML) {
				container = $.C("div");
				container.innerHTML = sHTML
			}
			var key, domList, totalList;
			totalList = $.core.dom.sizzle("[node-type]", container);
			domList = {};
			for (key in selectorList) {
				domList[key] = $.core.dom.sizzle.matches(selectorList[key].toString(), totalList)
			}
			var domBox = sHTML;
			if (_isHTML) {
				domBox = $.C("buffer");
				while (container.children[0]) {
					domBox.appendChild(container.children[0])
				}
			}
			return {
				box: domBox,
				list: domList
			}
		}
	});
	STK.register("core.util.scrollPos", function($) {
		return function(oDocument) {
			oDocument = oDocument || document;
			var dd = oDocument.documentElement;
			var db = oDocument.body;
			return {
				top: Math.max(window.pageYOffset || 0, dd.scrollTop, db.scrollTop),
				left: Math.max(window.pageXOffset || 0, dd.scrollLeft, db.scrollLeft)
			}
		}
	});
	STK.register("core.util.browser", function($) {
		var ua = navigator.userAgent.toLowerCase();
		var external = window.external || "";
		var core, m, extra, version, os;
		var numberify = function(s) {
				var c = 0;
				return parseFloat(s.replace(/\./g, function() {
					return (c++ == 1) ? "" : "."
				}))
			};
		try {
			if ((/windows|win32/i).test(ua)) {
				os = "windows"
			} else {
				if ((/macintosh/i).test(ua)) {
					os = "macintosh"
				} else {
					if ((/rhino/i).test(ua)) {
						os = "rhino"
					}
				}
			}
			if ((m = ua.match(/applewebkit\/([^\s]*)/)) && m[1]) {
				core = "webkit";
				version = numberify(m[1])
			} else {
				if ((m = ua.match(/presto\/([\d.]*)/)) && m[1]) {
					core = "presto";
					version = numberify(m[1])
				} else {
					if (m = ua.match(/msie\s([^;]*)/)) {
						core = "trident";
						version = 1;
						if ((m = ua.match(/trident\/([\d.]*)/)) && m[1]) {
							version = numberify(m[1])
						}
					} else {
						if (/gecko/.test(ua)) {
							core = "gecko";
							version = 1;
							if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
								version = numberify(m[1])
							}
						}
					}
				}
			}
			if (/world/.test(ua)) {
				extra = "world"
			} else {
				if (/360se/.test(ua)) {
					extra = "360"
				} else {
					if ((/maxthon/.test(ua)) || typeof external.max_version == "number") {
						extra = "maxthon"
					} else {
						if (/tencenttraveler\s([\d.]*)/.test(ua)) {
							extra = "tt"
						} else {
							if (/se\s([\d.]*)/.test(ua)) {
								extra = "sogou"
							}
						}
					}
				}
			}
		} catch (e) {}
		var ret = {
			OS: os,
			CORE: core,
			Version: version,
			EXTRA: (extra ? extra : false),
			IE: /msie/.test(ua),
			OPERA: /opera/.test(ua),
			MOZ: /gecko/.test(ua) && !/(compatible|webkit)/.test(ua),
			IE5: /msie 5 /.test(ua),
			IE55: /msie 5.5/.test(ua),
			IE6: /msie 6/.test(ua),
			IE7: /msie 7/.test(ua),
			IE8: /msie 8/.test(ua),
			IE9: /msie 9/.test(ua),
			SAFARI: !/chrome\/([\d.]*)/.test(ua) && /\/([\d.]*) safari/.test(ua),
			CHROME: /chrome\/([\d.]*)/.test(ua),
			IPAD: /\(ipad/i.test(ua),
			IPHONE: /\(iphone/i.test(ua),
			ITOUCH: /\(itouch/i.test(ua),
			MOBILE: /mobile/i.test(ua)
		};
		return ret
	});
	STK.register("core.obj.parseParam", function($) {
		return function(oSource, oParams, isown) {
			var key, obj = {};
			oParams = oParams || {};
			for (key in oSource) {
				obj[key] = oSource[key];
				if (oParams[key] != null) {
					if (isown) {
						if (oSource.hasOwnProperty[key]) {
							obj[key] = oParams[key]
						}
					} else {
						obj[key] = oParams[key]
					}
				}
			}
			return obj
		}
	});
	STK.register("core.dom.position", function($) {
		var generalPosition = function(el) {
				var box, scroll, body, docElem, clientTop, clientLeft;
				box = el.getBoundingClientRect();
				scroll = $.core.util.scrollPos();
				body = el.ownerDocument.body;
				docElem = el.ownerDocument.documentElement;
				clientTop = docElem.clientTop || body.clientTop || 0;
				clientLeft = docElem.clientLeft || body.clientLeft || 0;
				return {
					l: parseInt(box.left + scroll.left - clientLeft, 10) || 0,
					t: parseInt(box.top + scroll.top - clientTop, 10) || 0
				}
			};
		var countPosition = function(el, shell) {
				var pos;
				pos = [el.offsetLeft, el.offsetTop];
				parent = el.offsetParent;
				if (parent !== el && parent !== shell) {
					while (parent) {
						pos[0] += parent.offsetLeft;
						pos[1] += parent.offsetTop;
						parent = parent.offsetParent
					}
				}
				if ($.core.util.browser.OPERA != -1 || ($.core.util.browser.SAFARI != -1 && el.style.position == "absolute")) {
					pos[0] -= document.body.offsetLeft;
					pos[1] -= document.body.offsetTop
				}
				if (el.parentNode) {
					parent = el.parentNode
				} else {
					parent = null
				}
				while (parent && !/^body|html$/i.test(parent.tagName) && parent !== shell) {
					if (parent.style.display.search(/^inline|table-row.*$/i)) {
						pos[0] -= parent.scrollLeft;
						pos[1] -= parent.scrollTop
					}
					parent = parent.parentNode
				}
				return {
					l: parseInt(pos[0], 10),
					t: parseInt(pos[1], 10)
				}
			};
		return function(oElement, spec) {
			if (oElement == document.body) {
				return false
			}
			if (oElement.parentNode == null) {
				return false
			}
			if (oElement.style.display == "none") {
				return false
			}
			var conf = $.core.obj.parseParam({
				parent: null
			}, spec);
			if (oElement.getBoundingClientRect) {
				if (conf.parent) {
					var o = generalPosition(oElement);
					var p = generalPosition(conf.parent);
					return {
						l: o.l - p.l,
						t: o.t - p.t
					}
				} else {
					return generalPosition(oElement)
				}
			} else {
				return countPosition(oElement, conf.parent || document.body)
			}
		}
	});
	STK.register("core.dom.removeNode", function($) {
		return function(node) {
			node = $.E(node) || node;
			try {
				node.parentNode.removeChild(node)
			} catch (e) {}
		}
	});
	STK.register("core.evt.addEvent", function($) {
		return function(sNode, sEventType, oFunc) {
			var oElement = $.E(sNode);
			if (oElement == null) {
				return false
			}
			sEventType = sEventType || "click";
			if ((typeof oFunc).toLowerCase() != "function") {
				return
			}
			if (oElement.addEventListener) {
				oElement.addEventListener(sEventType, oFunc, false)
			} else {
				if (oElement.attachEvent) {
					oElement.attachEvent("on" + sEventType, oFunc)
				} else {
					oElement["on" + sEventType] = oFunc
				}
			}
			return true
		}
	});
	STK.register("core.evt.getEvent", function($) {
		return function() {
			if ($.IE) {
				return window.event
			} else {
				if (window.event) {
					return window.event
				}
				var o = arguments.callee.caller;
				var e;
				var n = 0;
				while (o != null && n < 40) {
					e = o.arguments[0];
					if (e && (e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent)) {
						return e
					}
					n++;
					o = o.caller
				}
				return e
			}
		}
	});
	STK.register("core.evt.fixEvent", function($) {
		return function(e) {
			e = e || $.core.evt.getEvent();
			if (!e.target) {
				e.target = e.srcElement;
				e.pageX = e.x;
				e.pageY = e.y
			}
			if (typeof e.layerX == "undefined") {
				e.layerX = e.offsetX
			}
			if (typeof e.layerY == "undefined") {
				e.layerY = e.offsetY
			}
			return e
		}
	});
	STK.register("core.evt.removeEvent", function($) {
		return function(el, evType, func, useCapture) {
			var _el = $.E(el);
			if (_el == null) {
				return false
			}
			if (typeof func != "function") {
				return false
			}
			if (_el.removeEventListener) {
				_el.removeEventListener(evType, func, useCapture)
			} else {
				if (_el.detachEvent) {
					_el.detachEvent("on" + evType, func)
				} else {
					_el["on" + evType] = null
				}
			}
			return true
		}
	});
	STK.register("core.arr.isArray", function($) {
		return function(o) {
			return Object.prototype.toString.call(o) === "[object Array]"
		}
	});
	STK.register("core.str.trim", function($) {
		return function(str) {
			if (typeof str !== "string") {
				throw "trim need a string as parameter"
			}
			var len = str.length;
			var s = 0;
			var reg = /(　|\s|\t| )/;
			while (s < len) {
				if (!reg.test(str.charAt(s))) {
					break
				}
				s += 1
			}
			while (len > s) {
				if (!reg.test(str.charAt(len - 1))) {
					break
				}
				len -= 1
			}
			return str.slice(s, len)
		}
	});
	STK.register("core.json.queryToJson", function($) {
		return function(QS, isDecode) {
			var _Qlist = $.core.str.trim(QS).split("&");
			var _json = {};
			var _fData = function(data) {
					if (isDecode) {
						return decodeURIComponent(data)
					} else {
						return data
					}
				};
			for (var i = 0, len = _Qlist.length; i < len; i++) {
				if (_Qlist[i]) {
					var _hsh = _Qlist[i].split("=");
					var _key = _hsh[0];
					var _value = _hsh[1];
					if (_hsh.length < 2) {
						_value = _key;
						_key = "$nullName"
					}
					if (!_json[_key]) {
						_json[_key] = _fData(_value)
					} else {
						if ($.core.arr.isArray(_json[_key]) != true) {
							_json[_key] = [_json[_key]]
						}
						_json[_key].push(_fData(_value))
					}
				}
			}
			return _json
		}
	});
	STK.register("core.dom.isNode", function($) {
		return function(node) {
			return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType)
		}
	});
	STK.register("core.dom.contains", function($) {
		return function(parent, node) {
			if (parent === node) {
				return false
			} else {
				if (parent.compareDocumentPosition) {
					return ((parent.compareDocumentPosition(node) & 16) === 16)
				} else {
					if (parent.contains && node.nodeType === 1) {
						return parent.contains(node)
					} else {
						while (node = node.parentNode) {
							if (parent === node) {
								return true
							}
						}
					}
				}
			}
			return false
		}
	});
	STK.register("core.obj.isEmpty", function($) {
		return function(o, isprototype) {
			var ret = true;
			for (var k in o) {
				if (isprototype) {
					ret = false;
					break
				} else {
					if (o.hasOwnProperty(k)) {
						ret = false;
						break
					}
				}
			}
			return ret
		}
	});
	STK.register("core.func.empty", function() {
		return function() {}
	});
	STK.register("core.evt.delegatedEvent", function($) {
		var checkContains = function(list, el) {
				for (var i = 0, len = list.length; i < len; i += 1) {
					if ($.core.dom.contains(list[i], el)) {
						return true
					}
				}
				return false
			};
		return function(actEl, expEls) {
			if (!$.core.dom.isNode(actEl)) {
				throw "core.evt.delegatedEvent need an Element as first Parameter"
			}
			if (!expEls) {
				expEls = []
			}
			if ($.core.arr.isArray(expEls)) {
				expEls = [expEls]
			}
			var evtList = {};
			var bindEvent = function(e) {
					var evt = $.core.evt.fixEvent(e);
					var el = evt.target;
					var type = e.type;
					var changeTarget = function() {
							var path, lis, tg;
							path = el.getAttribute("action-target");
							if (path) {
								lis = $.core.dom.sizzle(path, actEl);
								if (lis.length) {
									tg = evt.target = lis[0]
								}
							}
							changeTarget = $.core.func.empty;
							return tg
						};
					var checkBuble = function() {
							var tg = changeTarget() || el;
							if (evtList[type] && evtList[type][actionType]) {
								return evtList[type][actionType]({
									evt: evt,
									el: tg,
									box: actEl,
									data: $.core.json.queryToJson(tg.getAttribute("action-data") || "")
								})
							} else {
								return true
							}
						};
					if (checkContains(expEls, el)) {
						return false
					} else {
						if (!$.core.dom.contains(actEl, el)) {
							return false
						} else {
							var actionType = null;
							while (el && el !== actEl) {
								actionType = el.getAttribute("action-type");
								if (actionType && checkBuble() === false) {
									break
								}
								el = el.parentNode
							}
						}
					}
				};
			var that = {};
			that.add = function(funcName, evtType, process) {
				if (!evtList[evtType]) {
					evtList[evtType] = {};
					$.core.evt.addEvent(actEl, evtType, bindEvent)
				}
				var ns = evtList[evtType];
				ns[funcName] = process
			};
			that.remove = function(funcName, evtType) {
				if (evtList[evtType]) {
					delete evtList[evtType][funcName];
					if ($.core.obj.isEmpty(evtList[evtType])) {
						delete evtList[evtType];
						$.core.evt.removeEvent(actEl, evtType, bindEvent)
					}
				}
			};
			that.pushExcept = function(el) {
				expEls.push(el)
			};
			that.removeExcept = function(el) {
				if (!el) {
					expEls = []
				} else {
					for (var i = 0, len = expEls.length; i < len; i += 1) {
						if (expEls[i] === el) {
							expEls.splice(i, 1)
						}
					}
				}
			};
			that.clearExcept = function(el) {
				expEls = []
			};
			that.destroy = function() {
				for (k in evtList) {
					for (l in evtList[k]) {
						delete evtList[k][l]
					}
					delete evtList[k];
					$.core.evt.removeEvent(actEl, k, bindEvent)
				}
			};
			return that
		}
	});
	STK.register("core.evt.preventDefault", function($) {
		return function(e) {
			var ev = e ? e : $.core.evt.getEvent();
			if ($.IE) {
				ev.returnValue = false
			} else {
				ev.preventDefault()
			}
		}
	});
	STK.register("core.arr.foreach", function($) {
		var arrForeach = function(o, insp) {
				var r = [];
				for (var i = 0, len = o.length; i < len; i += 1) {
					var x = insp(o[i], i);
					if (x === false) {
						break
					} else {
						if (x !== null) {
							r[i] = x
						}
					}
				}
				return r
			};
		var objForeach = function(o, insp) {
				var r = {};
				for (var k in o) {
					var x = insp(o[k], k);
					if (x === false) {
						break
					} else {
						if (x !== null) {
							r[k] = x
						}
					}
				}
				return r
			};
		return function(o, insp) {
			if ($.core.arr.isArray(o) || (o.length && o[0] !== undefined)) {
				return arrForeach(o, insp)
			} else {
				if (typeof o === "object") {
					return objForeach(o, insp)
				}
			}
			return null
		}
	});
	STK.register("core.evt.stopEvent", function($) {
		return function(e) {
			var ev = e ? e : $.core.evt.getEvent();
			if ($.IE) {
				ev.cancelBubble = true;
				ev.returnValue = false
			} else {
				ev.preventDefault();
				ev.stopPropagation()
			}
			return false
		}
	});
	STK.register("core.str.queryString", function($) {
		return function(sKey, oOpts) {
			var opts = $.core.obj.parseParam({
				source: window.location.href.toString(),
				split: "&"
			}, oOpts);
			var rs = new RegExp("(^|)" + sKey + "=([^\\" + opts.split + "]*)(\\" + opts.split + "|$)", "gi").exec(opts.source),
				tmp;
			if (tmp = rs) {
				return tmp[2]
			}
			return null
		}
	});
	STK.register("core.util.getUniqueKey", function($) {
		var _loadTime = (new Date()).getTime().toString(),
			_i = 1;
		return function() {
			return _loadTime + (_i++)
		}
	});
	STK.register("core.str.parseURL", function($) {
		return function(url) {
			var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
			var names = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
			var results = parse_url.exec(url);
			var that = {};
			for (var i = 0, len = names.length; i < len; i += 1) {
				that[names[i]] = results[i] || ""
			}
			return that
		}
	});
	STK.register("core.json.jsonToQuery", function($) {
		var _fdata = function(data, isEncode) {
				data = data == null ? "" : data;
				data = $.core.str.trim(data.toString());
				if (isEncode) {
					return encodeURIComponent(data)
				} else {
					return data
				}
			};
		return function(JSON, isEncode) {
			var _Qstring = [];
			if (typeof JSON == "object") {
				for (var k in JSON) {
					if (k === "$nullName") {
						_Qstring = _Qstring.concat(JSON[k]);
						continue
					}
					if (JSON[k] instanceof Array) {
						for (var i = 0, len = JSON[k].length; i < len; i++) {
							_Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode))
						}
					} else {
						if (typeof JSON[k] != "function") {
							_Qstring.push(k + "=" + _fdata(JSON[k], isEncode))
						}
					}
				}
			}
			if (_Qstring.length) {
				return _Qstring.join("&")
			} else {
				return ""
			}
		}
	});
	STK.register("core.util.URL", function($) {
		return function(sURL, args) {
			var opts = $.core.obj.parseParam({
				isEncodeQuery: false,
				isEncodeHash: false
			}, args || {});
			var that = {};
			var url_json = $.core.str.parseURL(sURL);
			var query_json = $.core.json.queryToJson(url_json.query);
			var hash_json = $.core.json.queryToJson(url_json.hash);
			that.setParam = function(sKey, sValue) {
				query_json[sKey] = sValue;
				return this
			};
			that.getParam = function(sKey) {
				return query_json[sKey]
			};
			that.setParams = function(oJson) {
				for (var key in oJson) {
					that.setParam(key, oJson[key])
				}
				return this
			};
			that.setHash = function(sKey, sValue) {
				hash_json[sKey] = sValue;
				return this
			};
			that.getHash = function(sKey) {
				return hash_json[sKey]
			};
			that.valueOf = that.toString = function() {
				var url = [];
				var query = $.core.json.jsonToQuery(query_json, opts.isEncodeQuery);
				var hash = $.core.json.jsonToQuery(hash_json, opts.isEncodeQuery);
				if (url_json.scheme != "") {
					url.push(url_json.scheme + ":");
					url.push(url_json.slash)
				}
				if (url_json.host != "") {
					url.push(url_json.host);
					if (url_json.port != "") {
						url.push(":");
						url.push(url_json.port)
					}
				}
				url.push("/");
				url.push(url_json.path);
				if (query != "") {
					url.push("?" + query)
				}
				if (hash != "") {
					url.push("#" + hash)
				}
				return url.join("")
			};
			return that
		}
	});
	STK.register("core.io.scriptLoader", function($) {
		var entityList = {};
		var default_opts = {
			url: "",
			charset: "UTF-8",
			timeout: 30 * 1000,
			args: {},
			onComplete: $.core.func.empty,
			onTimeout: null,
			isEncode: false,
			uniqueID: null
		};
		return function(oOpts) {
			var js, requestTimeout;
			var opts = $.core.obj.parseParam(default_opts, oOpts);
			if (opts.url == "") {
				throw "scriptLoader: url is null"
			}
			var uniqueID = opts.uniqueID || $.core.util.getUniqueKey();
			js = entityList[uniqueID];
			if (js != null && $.IE != true) {
				$.core.dom.removeNode(js);
				js = null
			}
			if (js == null) {
				js = entityList[uniqueID] = $.C("script")
			}
			js.charset = opts.charset;
			js.id = "scriptRequest_script_" + uniqueID;
			js.type = "text/javascript";
			if (opts.onComplete != null) {
				if ($.IE) {
					js.onreadystatechange = function() {
						if (js.readyState.toLowerCase() == "loaded" || js.readyState.toLowerCase() == "complete") {
							try {
								clearTimeout(requestTimeout);
								document.getElementsByTagName("head")[0].removeChild(js);
								js.onreadystatechange = null
							} catch (exp) {}
							opts.onComplete()
						}
					}
				} else {
					js.onload = function() {
						try {
							clearTimeout(requestTimeout);
							$.core.dom.removeNode(js)
						} catch (exp) {}
						opts.onComplete()
					}
				}
			}
			js.src = STK.core.util.URL(opts.url, {
				isEncodeQuery: opts.isEncode
			}).setParams(opts.args);
			document.getElementsByTagName("head")[0].appendChild(js);
			if (opts.timeout > 0 && opts.onTimeout != null) {
				requestTimeout = setTimeout(function() {
					try {
						document.getElementsByTagName("head")[0].removeChild(js)
					} catch (exp) {}
					opts.onTimeout()
				}, opts.timeout)
			}
			return js
		}
	});
	STK.register("core.io.jsonp", function($) {
		return function(oOpts) {
			var opts = $.core.obj.parseParam({
				url: "",
				charset: "UTF-8",
				timeout: 30 * 1000,
				args: {},
				onComplete: null,
				onTimeout: null,
				responseName: null,
				isEncode: false,
				varkey: "callback"
			}, oOpts);
			var funcStatus = -1;
			var uniqueID = opts.responseName || ("STK_" + $.core.util.getUniqueKey());
			opts.args[opts.varkey] = uniqueID;
			var completeFunc = opts.onComplete;
			var timeoutFunc = opts.onTimeout;
			window[uniqueID] = function(oResult) {
				if (funcStatus != 2 && completeFunc != null) {
					funcStatus = 1;
					completeFunc(oResult)
				}
			};
			opts.onComplete = null;
			opts.onTimeout = function() {
				if (funcStatus != 1 && timeoutFunc != null) {
					funcStatus = 2;
					timeoutFunc()
				}
			};
			return $.core.io.scriptLoader(opts)
		}
	});
	STK.register("common.login", function($) {
		var trim = $.core.str.trim;
		var that = {};
		var ENTRY = "openapi";
		window.sinaSSOConfig = {
			entry: ENTRY,
			domain: "weibo.com",
			customLoginCallBack: function() {},
			customLogoutCallBack: function() {},
			useTicket: true
		};
		var loadSSO = function(callback) {
				if (typeof window.sinaSSOController != "undefined") {
					callback()
				} else {
					$.core.io.scriptLoader({
						url: "/oauth2/js/sso/ssologin.js",
						onComplete: function() {
							setTimeout(callback, 0)
						}
					})
				}
			};
		that.preLogin = function(userName, callback) {
			var _preLogin = function() {
					sinaSSOController.prelogin({
						username: userName,
						checkpin: 1
					}, callback)
				};
			loadSSO(_preLogin)
		};
		that.doLogin = function(param) {
			var conf = $.core.obj.parseParam({
				userId: "",
				passWd: "",
				door: "",
				vsnval: "",
				appkey: "",
				remTime: 0,
				callback: function() {}
			}, param);
			var userId = trim(conf.userId),
				passWd = trim(conf.passWd);
			var _login = function() {
					sinaSSOController.customLoginCallBack = conf.callback;
					sinaSSOController.loginExtraQuery.ct = 1800;
					sinaSSOController.crossDomain = false;
					sinaSSOController.loginExtraQuery.s = 1;
					sinaSSOController.loginExtraQuery.vsnf = 1;
					sinaSSOController.loginExtraQuery.vsnval = conf.vsnval;
					sinaSSOController.loginExtraQuery.door = conf.door;
					sinaSSOController.loginExtraQuery.appkey = conf.appkey;
					sinaSSOController.login(userId, passWd, conf.remTime)
				};
			loadSSO(_login)
		};
		that.doLogout = function() {
			var url = $.E("url").value || document.location.href;
			if (document.location.host.indexOf("weibo.cn") != -1) {
				document.location.href = "http://api.weibo.cn/interface/f/login/logout.php?backUrl=" + encodeURIComponent(url);
				return
			}
			document.location.href = "http://login.sina.com.cn/sso/logout.php?entry=" + ENTRY + "&r=" + encodeURIComponent(url)
		};
		return that
	});
	STK.register("common.resize", function() {
		var defaultConfig = {
			width: 750 + 20,
			height: 450 + 180
		};

		function setSize(conf) {
			if (!/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
				(function(w, d) {
					var dw, dh, de = d.documentElement;
					dw = (de && de.clientWidth) ? de.clientWidth : d.body.clientWidth;
					dh = (de && de.clientHeight) ? de.clientHeight : d.body.clientHeight;
					try {
						if (dw < conf.width || dh < conf.height) {
							w.resizeTo(conf.width, conf.height)
						}
						var resizeList = "js,popup";
						var display = $.core.json.queryToJson(document.location.search.substr(1)).display || 0;
						if (resizeList.indexOf(display) == -1) {
							return
						}
						var left = (w.screen.width - conf.width) / 2,
							top = (w.screen.height - conf.height) / 2;
						w.moveTo(left, top)
					} catch (e) {}
				})(window, document)
			}
		}
		return function(opts) {
			var conf = $.core.obj.parseParam(defaultConfig, opts);
			setSize(conf)
		}
	});
	STK.register("ui.simpleTip", function($) {
		var addEvent = $.core.evt.addEvent;
		return function(nodes) {
			var that = {};
			var outer, close, content;
			var argsCheck = function() {
					if (!nodes.tipBox) {
						throw "node[tipBox] is not defined"
					}
				};
			var parseDOM = function() {
					outer = nodes.tipBox;
					close = nodes.tipClose;
					content = nodes.tipContent
				};
			var bindDOM = function() {
					addEvent(close, "click", hide)
				};
			var hide = function() {
					outer.style.display = "none"
				};
			var show = function() {
					outer.style.display = ""
				};
			var setContent = function(cont) {
					if (typeof cont === "string") {
						content.innerHTML = cont
					}
					return that
				};
			var init = function() {
					argsCheck();
					parseDOM();
					bindDOM()
				};
			init();
			that.show = show;
			that.hide = hide;
			that.setContent = setContent;
			return that
		}
	});
	STK.register("common.privacy", function($) {
		var addEvent = $.core.evt.addEvent;
		var stopEvent = $.core.evt.stopEvent;
		return function(nodes, display) {
			var selectorFun = {
				init: function() {
					if (nodes.arrow_btn || nodes.privacy) {
						var input = sizzle("input[name=visible]")[0];
						nodes.visible = input;
						if (display == "mobile") {
							addEvent(nodes.privacy, "change", selectorFun.itemSelect)
						} else {
							addEvent(nodes.arrow_btn, "click", selectorFun.btnClickHandler);
							addEvent(nodes.current_status, "click", selectorFun.textClickHandler);
							addEvent(nodes.options_outer, "click", selectorFun.itemClickHandler);
							addEvent(document, "click", selectorFun.documentClickHandler)
						}
					}
				},
				textClickHandler: function(evt) {
					var evt = evt || window.event;
					stopEvent(evt)
				},
				btnClickHandler: function(evt) {
					var evt = evt || window.event();
					stopEvent(evt);
					nodes.options_outer.style.display = ""
				},
				documentClickHandler: function(evt) {
					nodes.options_outer.style.display = "none"
				},
				itemSelect: function() {
					nodes.visible.value = nodes.privacy.value
				},
				itemClickHandler: function(e) {
					var event = $.core.evt.fixEvent(e),
						node = event.target,
						attr = node.getAttribute("action-data");
					stopEvent(event);
					if (attr) {
						var data = $.core.json.queryToJson(attr);
						nodes.visible.value = data.visible;
						nodes.current_status.innerHTML = node.innerHTML;
						nodes.options_outer.style.display = "none"
					}
				}
			};
			selectorFun.init()
		}
	});
	STK.register("core.util.hideContainer", function($) {
		var hideDiv;
		var initDiv = function() {
				if (hideDiv) {
					return
				}
				hideDiv = $.C("div");
				hideDiv.style.cssText = "position:absolute;top:-9999px;left:-9999px;";
				document.getElementsByTagName("head")[0].appendChild(hideDiv)
			};
		var that = {
			appendChild: function(el) {
				if ($.core.dom.isNode(el)) {
					initDiv();
					hideDiv.appendChild(el)
				}
			},
			removeChild: function(el) {
				if ($.core.dom.isNode(el)) {
					hideDiv && hideDiv.removeChild(el)
				}
			}
		};
		return that
	});
	STK.register("core.dom.getSize", function($) {
		var size = function(dom) {
				if (!$.core.dom.isNode(dom)) {
					throw "core.dom.getSize need Element as first parameter"
				}
				return {
					width: dom.offsetWidth,
					height: dom.offsetHeight
				}
			};
		var getSize = function(dom) {
				var ret = null;
				if (dom.style.display === "none") {
					dom.style.visibility = "hidden";
					dom.style.display = "";
					ret = size(dom);
					dom.style.display = "none";
					dom.style.visibility = "visible"
				} else {
					ret = size(dom)
				}
				return ret
			};
		return function(dom) {
			var ret = {};
			if (!dom.parentNode) {
				$.core.util.hideContainer.appendChild(dom);
				ret = getSize(dom);
				$.core.util.hideContainer.removeChild(dom)
			} else {
				ret = getSize(dom)
			}
			return ret
		}
	});
	STK.register("core.dom.getStyle", function($) {
		return function(node, property) {
			if ($.IE) {
				switch (property) {
				case "opacity":
					var val = 100;
					try {
						val = node.filters["DXImageTransform.Microsoft.Alpha"].opacity
					} catch (e) {
						try {
							val = node.filters("alpha").opacity
						} catch (e) {}
					}
					return val / 100;
				case "float":
					property = "styleFloat";
				default:
					var value = node.currentStyle ? node.currentStyle[property] : null;
					return (node.style[property] || value)
				}
			} else {
				if (property == "float") {
					property = "cssFloat"
				}
				try {
					var computed = document.defaultView.getComputedStyle(node, "")
				} catch (e) {}
				return node.style[property] || computed ? computed[property] : null
			}
		}
	});
	STK.register("core.dom.setStyle", function($) {
		return function(node, property, val) {
			if ($.IE) {
				switch (property) {
				case "opacity":
					node.style.filter = "alpha(opacity=" + (val * 100) + ")";
					if (!node.currentStyle || !node.currentStyle.hasLayout) {
						node.style.zoom = 1
					}
					break;
				case "float":
					property = "styleFloat";
				default:
					node.style[property] = val
				}
			} else {
				if (property == "float") {
					property = "cssFloat"
				}
				node.style[property] = val
			}
		}
	});
	STK.register("common.placeholder", function($) {
		var addEvent = $.core.evt.addEvent;
		var stopEvent = $.core.evt.stopEvent;
		var setStyle = $.core.dom.setStyle;
		var getStyle = $.core.dom.getStyle;

		function isPlaceholer() {
			var input = document.createElement("input");
			return "placeholder" in input
		}
		var isSupported = isPlaceholer();
		var direction = ["Top", "Right", "Bottom", "Left"];

		function addPlaceholder(input, opts) {
			var conf = $.core.obj.parseParam({
				dom: null,
				text: input.getAttribute("placeholder"),
				color: "#9a9a9a",
				force: false
			}, opts);
			text = conf.text || "";
			if (isSupported && !conf.force) {
				input.setAttribute("placeholder", text);
				return
			}
			var label;
			if (conf.dom && $.core.dom.isNode(conf.dom)) {
				label = conf.dom
			} else {
				label = $.C("label");
				label.innerHTML = text;
				var pos = $.core.dom.position(input);
				var size = $.core.dom.getSize(input);
				var styles = ["position:absolute"];
				styles.push("width:" + size.width + "px");
				styles.push("height:" + size.height + "px");
				styles.push("line-height:" + size.height + "px");
				styles.push("color:" + conf.color);
				var margin = "",
					padding = "";
				for (var i = 0, len = direction.length; i < len; i++) {
					margin += " " + getStyle(input, "margin" + direction[i]);
					padding += " " + getStyle(input, "padding" + direction[i])
				}
				styles.push("margin:" + margin);
				styles.push("padding:" + padding);
				styles.push("left:" + (pos.l + 2) + "px");
				styles.push("top:" + (pos.t + 2) + "px");
				styles.push("font-size:" + parseInt(getStyle(input, "fontSize")) + "px");
				label.style.cssText = styles.join(";");
				document.body.appendChild(label)
			}
			if (input.value != "") {
				label.style.display = "none"
			}
			addEvent(label, "click", function() {
				label.style.display = "none";
				input.focus()
			});
			addEvent(input, "focus", function() {
				label.style.display = "none"
			});
			addEvent(input, "blur", function() {
				if (input.value == "") {
					label.style.display = "block"
				}
			});
			return label
		}
		return function(node, conf) {
			var that = {};
			var label;
			if ($.core.dom.isNode(node)) {
				label = addPlaceholder(node, conf)
			}
			var reSetPos = function() {
					var pos = $.core.dom.position(node);
					label.style.left = pos.l + "px";
					label.style.top = pos.t + "px"
				};
			var show = function() {
					label.style.display = "block"
				};
			var hide = function() {
					label.style.display = "none"
				};
			that.reSetPos = reSetPos;
			that.show = show;
			that.hide = hide;
			return that
		}
	});
	STK.register("common.tabControl", function($) {
		var addEvent = $.core.evt.addEvent;
		var stopEvent = $.core.evt.stopEvent;
		var removeEvent = $.core.evt.removeEvent;
		var setStyle = $.core.dom.setStyle;
		var getStyle = $.core.dom.getStyle;
		var sizzle = $.core.dom.sizzle;
		var allTabIndexs = [],
			tabIndex;
		var onEnterKey;
		var tab = {
			isObjectHidden: function(node) {
				var isHidden;
				if (typeof node.nodeType != "undefined" && node.nodeType != 1) {
					return false
				}
				isHidden = getStyle(node, "display") == "none";
				if (isHidden) {
					return true
				} else {
					while (node != document.body) {
						return tab.isObjectHidden(node.parentNode)
					}
				}
			},
			eventSet: function(status) {
				if (allTabIndexs.length > 0) {
					for (var i = 0, len = allTabIndexs.length; i < len; i++) {
						if (allTabIndexs[i].tagName.toLowerCase() == "textarea" || (allTabIndexs[i].tagName.toLowerCase() == "input" && (allTabIndexs[i].type == "text" || allTabIndexs[i].type == "password" || allTabIndexs[i].type == "email"))) {
							if (status == true) {
								addEvent(allTabIndexs[i], "keyup", tab.stopBubble)
							} else {
								removeEvent(allTabIndexs[i], "keyup", tab.stopBubble)
							}
						}
					}
					if (status == false) {
						allTabIndexs = []
					}
				}
			},
			getAllTabIndexObjects: function() {
				tab.eventSet(false);
				var objs = sizzle("[tabindex]");
				var result = [];
				if (objs.length > 0) {
					for (var i = 0; i < objs.length; i++) {
						if (tab.isObjectHidden(objs[i]) != true) {
							result.push(objs[i])
						}
					}
				}
				allTabIndexs = result;
				tab.eventSet(true)
			},
			getTabIndex: function(diff) {
				if (isNaN(tabIndex)) {
					tabIndex = 0
				} else {
					if (diff > 0) {
						tabIndex++;
						if (tabIndex == allTabIndexs.length) {
							tabIndex = 0
						}
					} else {
						tabIndex--;
						if (tabIndex < 0) {
							tabIndex = allTabIndexs.length - 1
						}
					}
				}
				return tabIndex
			},
			tabChange: function(e) {
				if (allTabIndexs.length == 0) {
					return
				}
				var pos;
				try {
					switch (e.keyCode) {
					case 37:
					case 38:
						pos = tab.getTabIndex(-1);
						allTabIndexs[pos].focus();
						break;
					case 39:
					case 40:
						pos = tab.getTabIndex(1);
						allTabIndexs[pos].focus();
						break;
					case 13:
						onEnterKey();
						break
					}
				} catch (exp) {}
			},
			stopBubble: function(e) {
				if (!(e.keyCode == 38 || e.keyCode == 40)) {
					stopEvent()
				}
			}
		};
		return function(conf) {
			var allTabIndexs, tabIndex;
			var that = {};
			onEnterKey = conf.onEnterKey;
			that.rebuild = tab.getAllTabIndexObjects;
			tab.getAllTabIndexObjects();
			addEvent(document.body, "keyup", tab.tabChange);
			return that
		}
	});
	STK.register("core.io.getXHR", function($) {
		return function() {
			var _XHR = false;
			try {
				_XHR = new XMLHttpRequest()
			} catch (try_MS) {
				try {
					_XHR = new ActiveXObject("Msxml2.XMLHTTP")
				} catch (other_MS) {
					try {
						_XHR = new ActiveXObject("Microsoft.XMLHTTP")
					} catch (failed) {
						_XHR = false
					}
				}
			}
			return _XHR
		}
	});
	STK.register("core.io.ajax", function($) {
		return function(oOpts) {
			var opts = $.core.obj.parseParam({
				url: "",
				charset: "UTF-8",
				timeout: 30 * 1000,
				args: {},
				onComplete: null,
				onTimeout: $.core.func.empty,
				uniqueID: null,
				onFail: $.core.func.empty,
				method: "get",
				asynchronous: true,
				header: {},
				isEncode: false,
				responseType: "json"
			}, oOpts);
			if (opts.url == "") {
				throw "ajax need url in parameters object"
			}
			var tm;
			var trans = $.core.io.getXHR();
			var cback = function() {
					if (trans.readyState == 4) {
						clearTimeout(tm);
						var data = "";
						if (opts.responseType === "xml") {
							data = trans.responseXML
						} else {
							if (opts.responseType === "text") {
								data = trans.responseText
							} else {
								try {
									if (trans.responseText && typeof trans.responseText === "string") {
										data = eval("(" + trans.responseText + ")")
									} else {
										data = {}
									}
								} catch (exp) {
									data = opts.url + "return error : data error"
								}
							}
						}
						if (trans.status == 200) {
							if (opts.onComplete != null) {
								opts.onComplete(data)
							}
						} else {
							if (trans.status == 0) {} else {
								if (opts.onFail != null) {
									opts.onFail(data, trans)
								}
							}
						}
					} else {
						if (opts.onTraning != null) {
							opts.onTraning(trans)
						}
					}
				};
			trans.onreadystatechange = cback;
			if (!opts.header["Content-Type"]) {
				opts.header["Content-Type"] = "application/x-www-form-urlencoded"
			}
			if (!opts.header["X-Requested-With"]) {
				opts.header["X-Requested-With"] = "XMLHttpRequest"
			}
			if (opts.method.toLocaleLowerCase() == "get") {
				var url = $.core.util.URL(opts.url, {
					isEncodeQuery: opts.isEncode
				});
				url.setParams(opts.args);
				url.setParam("__rnd", new Date().valueOf());
				trans.open(opts.method, url, opts.asynchronous);
				try {
					for (var k in opts.header) {
						trans.setRequestHeader(k, opts.header[k])
					}
				} catch (exp) {}
				trans.send("")
			} else {
				trans.open(opts.method, opts.url, opts.asynchronous);
				try {
					for (var k in opts.header) {
						trans.setRequestHeader(k, opts.header[k])
					}
				} catch (exp) {}
				trans.send($.core.json.jsonToQuery(opts.args, opts.isEncode))
			}
			if (opts.timeout) {
				tm = setTimeout(function() {
					try {
						trans.abort()
					} catch (exp) {}
					opts.onTimeout({}, trans);
					opts.onFail(data, trans)
				}, opts.timeout)
			}
			return trans
		}
	});
	STK.register("core.util.nameValue", function($) {
		return function(node) {
			var _name = node.getAttribute("name");
			var _type = node.getAttribute("type");
			var _el = node.tagName;
			var _value = {
				name: _name,
				value: ""
			};
			var _setVl = function(vl) {
					if (vl === false) {
						_value = false
					} else {
						if (!_value.value) {
							_value.value = $.core.str.trim((vl || ""))
						} else {
							_value.value = [$.core.str.trim((vl || ""))].concat(_value.value)
						}
					}
				};
			if (!node.disabled && _name) {
				switch (_el) {
				case "INPUT":
					if (_type == "radio" || _type == "checkbox") {
						if (node.checked) {
							_setVl(node.value)
						} else {
							_setVl(false)
						}
					} else {
						if (_type == "reset" || _type == "submit" || _type == "image") {
							_setVl(false)
						} else {
							_setVl(node.value)
						}
					}
					break;
				case "SELECT":
					if (node.multiple) {
						var _ops = node.options;
						for (var i = 0, len = _ops.length; i < len; i++) {
							if (_ops[i].selected) {
								_setVl(_ops[i].value)
							}
						}
					} else {
						_setVl(node.value)
					}
					break;
				case "TEXTAREA":
					_setVl(node.value || node.getAttribute("value") || false);
					break;
				case "BUTTON":
				default:
					_setVl(node.value || node.getAttribute("value") || node.innerHTML || false)
				}
			} else {
				return false
			}
			return _value
		}
	});
	STK.register("core.util.htmlToJson", function($) {
		return function(mainBox, tagNameList, isClear) {
			var _retObj = {};
			tagNameList = tagNameList || ["INPUT", "TEXTAREA", "BUTTON", "SELECT"];
			if (!mainBox || !tagNameList) {
				return false
			}
			var _opInput = $.core.util.nameValue;
			for (var i = 0, len = tagNameList.length; i < len; i++) {
				var _tags = mainBox.getElementsByTagName(tagNameList[i]);
				for (var j = 0, lenTag = _tags.length; j < lenTag; j++) {
					var _info = _opInput(_tags[j]);
					if (!_info || (isClear && (_info.value === ""))) {
						continue
					}
					if (_retObj[_info.name]) {
						if (_retObj[_info.name] instanceof Array) {
							_retObj[_info.name] = _retObj[_info.name].concat(_info.value)
						} else {
							_retObj[_info.name] = [_retObj[_info.name]].concat(_info.value)
						}
					} else {
						_retObj[_info.name] = _info.value
					}
				}
			}
			return _retObj
		}
	});
	var $ = STK,
		addEvent = $.core.evt.addEvent,
		removeEvent = $.core.evt.removeEvent,
		trim = $.core.str.trim,
		sizzle = $.core.dom.sizzle,
		stopEvent = $.core.evt.stopEvent;
	if (navigator.userAgent.toLowerCase().indexOf("trident") > -1 && navigator.userAgent.indexOf("rv") > -1) {
		$.IE = true
	}
	var MSG = {
		LOGINMSG: "请用微博帐号登录",
		CAPSLOCK: "键盘大写锁定已打开，请注意",
		USERNAME: "请输入微博帐号",
		PASSWORD: "请输入密码",
		VDUNCODE: "请输入微盾显示的动态密码",
		CHECKPIN: "请输入验证码",
		CLOSETIP: "授权尚未完成，确定现在关闭窗口？",
		QRSCANED: "扫描成功！点击手机上的确认即可登录",
		CODEUSED: "二维码重复使用，请重新刷新后再扫描",
		QTIMEOUT: "二维码已过期",
		QREXCEPT: "二维码登录检查异常",
		QSUCCESS: "登录成功",
		QFAILURE: "登录失败",
		QRLOGIN: "二维码登录",
		LOGIN: "普通登录"
	};
	var MSG_EN = {
		LOGINMSG: "Use Weibo accout to log in",
		CAPSLOCK: "Caution: Caps Lock is active.",
		USERNAME: "Please input Weibo account",
		PASSWORD: "Please input password",
		VDUNCODE: "Please input weidun secure id",
		CHECKPIN: "please input captcha code",
		CLOSETIP: "Authorization has not been completed yet. Close the window?",
		QRSCANED: "Scanned successfully. Select OK on your phone to continue.",
		CODEUSED: "This QR code has already been used. Please refresh the code and scan again.",
		QTIMEOUT: "QR code has expired.",
		QREXCEPT: "Failed to check the QR code.",
		QSUCCESS: "Logged in successfully.",
		QFAILURE: "Failed to login.",
		QRLOGIN: "Log in with QR codes.",
		LOGIN: "Log in."
	};
	var LANGUAGE = "cn";
	if ($.E("language")) {
		LANGUAGE = $.E("language").value.toLowerCase()
	}
	function getMSG(key) {
		return LANGUAGE == "cn" ? MSG[key] : MSG_EN[key]
	}
	var FOCUS_COLOR = "#666666";
	var BLUR_COLOR = "#9A9A9A";
	var initJs = function(node) {
			var nodes, delegateEvt, tip, vdunBox, vcodeBox, currEle, placeHolder, QR, checkVdun = false,
				checkCode = false,
				preCheck = false;
			var tabController;
			var tempUserId;
			var subCss = [];
			var acDom = $.E("action"),
				display = $.E("display").value;
			var acVal = acDom.value,
				appkey = sizzle("input[name=appkey62]")[0].value || "";
			var argsCheck = function() {
					if (!node) {
						throw "node is not defined"
					}
				};
			var parseDOM = function() {
					nodes = $.kit.dom.parseDOM($.core.dom.builder(node).list);
					vdunBox = nodes.vdunBox;
					vcodeBox = nodes.validateBox;
					if (display == "mobile") {
						subCss = ["btnP", "btnG"]
					} else {
						var css = nodes.submit.className;
						cssArr = css.split(" ");
						subCss = [css, cssArr[0] + "Ing " + cssArr[1]]
					}
				};
			var bindDOM = function() {
					delegateEvt = $.core.evt.delegatedEvent(node);
					delegateEvt.add("submit", "click", loginFuns.submit);
					delegateEvt.add("logout", "click", loginFuns.logout);
					delegateEvt.add("changeAccount", "click", loginFuns.changeAccount);
					addEvent(nodes.cancel, "click", loginFuns.cancel);
					addEvent(nodes.loginswitch, "click", loginFuns.loginswitch);
					delegateEvt.add("qrmsgclose", "click", loginFuns.loginswitch);
					addEvent(nodes.help, "mouseover", loginFuns.helpshow);
					addEvent(nodes.help, "mouseout", loginFuns.helphide);
					if (nodes.userid) {
						addEvent(nodes.form, "submit", loginFuns.submit);
						addEvent(nodes.userid, "focus", loginFuns.toggleTipText);
						addEvent(nodes.userid, "blur", loginFuns.toggleTipText);
						addEvent(nodes.userid, "click", loginFuns.hideTip);
						addEvent(nodes.passwd, "click", loginFuns.hideTip);
						addEvent(nodes.passwd, "keypress", loginFuns.capslock);
						addEvent(nodes.changeCode, "click", loginFuns.pinCode);
						addEvent(window, "resize", function() {
							placeHolder && placeHolder.reSetPos()
						})
					}
					if (acVal == "scope") {
						addEvent(window, "beforeunload", showCloseTip)
					}
					if (display == "mobile") {
						addEvent(document, "click", loginFuns.hideAccountTip)
					}
					tabController = $.common.tabControl({
						onEnterKey: loginFuns.submit
					})
				};
			var getCheckBoxValue = function() {
					var val = [];
					var checkBoxs = sizzle("input[type=checkbox]", node);
					$.core.arr.foreach(checkBoxs, function(v, i) {
						v.checked && val.push(v.value)
					});
					return val.join(",")
				};
			var loginFuns = {
				submit: function() {
					var flag = $.E("officalFlag");
					$.E("withOfficalFlag").value = (flag && flag.checked) ? "1" : "0";
					if (nodes.userid) {
						$.core.evt.preventDefault();
						if (preCheck) {
							return
						}
						var userId = nodes.userid.value;
						var passWd = nodes.passwd.value;
						var vsnval = "",
							door = "";
						if (userId == "" || userId == getMSG("LOGINMSG")) {
							tip.setContent(getMSG("USERNAME")).show();
							loginFuns.getAllTabIndexObjects();
							return
						}
						if (passWd == "") {
							tip.setContent(getMSG("PASSWORD")).show();
							loginFuns.getAllTabIndexObjects();
							return
						}
						if (checkVdun) {
							vsnval = trim(nodes.vdun.value);
							if (vsnval == "" || vsnval.length < 6) {
								tip.setContent(getMSG("VDUNCODE")).show();
								loginFuns.getAllTabIndexObjects();
								return
							}
						}
						if (checkCode) {
							door = trim(nodes.vcode.value);
							if (door == "") {
								tip.setContent(getMSG("CHECKPIN")).show();
								loginFuns.getAllTabIndexObjects();
								return
							}
						}
						loginFuns.hideTip();
						nodes.submit.className = subCss[1];
						$.common.login.doLogin({
							userId: userId,
							passWd: passWd,
							vsnval: vsnval,
							door: door,
							appkey: appkey,
							callback: loginFuns.callback
						})
					} else {
						switch (acVal) {
						case "login":
						case "authorize":
							nodes.submit.className = subCss[1];
							break;
						case "scope":
							$.E("scope").value = getCheckBoxValue();
							removeEvent(window, "beforeunload", showCloseTip);
							break
						}
						nodes.form.submit()
					}
				},
				logout: function() {
					$.core.evt.stopEvent();
					$.common.login.doLogout()
				},
				changeAccount: function() {
					$.core.evt.stopEvent();
					nodes.account && (nodes.account.className = "logins logins_open")
				},
				hideAccountTip: function() {
					nodes.account && (nodes.account.className = "logins")
				},
				toggleTipText: function(e) {
					var input = nodes.userid;
					if (input.value == getMSG("LOGINMSG") && e.type == "focus") {
						input.value = "";
						input.style.color = FOCUS_COLOR
					} else {
						if (input.value == "" && e.type == "blur") {
							input.value = getMSG("LOGINMSG");
							input.style.color = BLUR_COLOR
						}
						if (input.value != getMSG("LOGINMSG") && input.value != tempUserId) {
							tempUserId = input.value;
							preCheck = true;
							$.common.login.preLogin(input.value, function(obj) {
								preCheck = false;
								switch (obj.showpin) {
								case 1:
									loginFuns.pinCode();
									loginFuns.hideVdun();
									break;
								case 2:
									loginFuns.hidePinCode();
									loginFuns.showVdun();
									break;
								case 0:
								default:
									loginFuns.hideVdun();
									loginFuns.hidePinCode()
								}
							})
						}
					}
				},
				hideTip: function() {
					tip && tip.hide();
					loginFuns.getAllTabIndexObjects()
				},
				pinCode: function(obj) {
					var codePic = sinaSSOController.getPinCodeUrl();
					nodes.pincode.src = codePic;
					nodes.vcode.value = "";
					vcodeBox.style.display = "";
					checkCode = true;
					obj && obj.reason && tip.setContent(obj.reason).show();
					loginFuns.getAllTabIndexObjects()
				},
				hidePinCode: function() {
					checkCode = false;
					vcodeBox.style.display = "none"
				},
				showVdun: function(obj) {
					vdunBox.style.display = "";
					checkVdun = true;
					nodes.vdun.value = "";
					obj && obj.reason && tip.setContent(obj.reason).show();
					loginFuns.getAllTabIndexObjects()
				},
				hideVdun: function() {
					checkVdun = false;
					vdunBox.style.display = "none"
				},
				capslock: function(e) {
					e = $.core.evt.fixEvent(e);
					var keyCode = e.keyCode || e.which;
					var isShift = e.shiftKey || (keyCode == 16) || false;
					if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
						tip.setContent(getMSG("CAPSLOCK")).show();
						loginFuns.getAllTabIndexObjects()
					} else {
						loginFuns.hideTip()
					}
				},
				cancel: function() {
					switch (acVal) {
					case "login":
						acDom.value = "refused";
						nodes.userid && (nodes.userid.value = "");
						break;
					case "authorize":
						acDom.value = "refused";
						break;
					case "scope":
						$.E("scope").value = "";
						break
					}
					nodes.form.submit()
				},
				callback: function(obj) {
					if (!obj.result) {
						switch (obj.errno) {
						case "5024":
						case "5025":
							loginFuns.showVdun(obj);
							break;
						case "4049":
						case "2070":
							loginFuns.pinCode(obj);
							break;
						default:
							if (checkCode) {
								loginFuns.pinCode(obj)
							}
							tip.setContent(obj.reason).show();
							loginFuns.getAllTabIndexObjects();
							break
						}
						nodes.submit.className = subCss[0];
						return
					}
					if (obj.ticket != "") {
						$.E("ticket").value = obj.ticket;
						nodes.userid.value = "";
						nodes.passwd.value = ""
					}
					nodes.form.submit()
				},
				getAllTabIndexObjects: function() {
					tabController.rebuild()
				},
				helpshow: function() {
					nodes.helplayer.style.display = "block"
				},
				helphide: function() {
					nodes.helplayer.style.display = "none"
				},
				loginTimer: null,
				loginswitch: function() {
					if (nodes.loginswitch.innerHTML == getMSG("QRLOGIN")) {
						nodes.loginswitch.innerHTML = getMSG("LOGIN");
						nodes.commonlogin.style.display = "none";
						nodes.qrcodelogin.style.display = "";
						var result = $.core.util.htmlToJson(nodes.form);
						$.core.io.ajax({
							url: "/oauth2/qrcode_authorize/generate",
							args: {
								client_id: result.client_id,
								redirect_uri: encodeURIComponent(result.redirect_uri),
								scope: result.scope,
								response_type: result.response_type,
								state: result.state
							},
							onComplete: function(ret) {
								loginFuns.vcode = ret.vcode;
								var image = new Image();
								image.src = ret.url;
								image.onload = function() {
									nodes.qrimage.appendChild(image);
									image.onload = null
								};
								loginFuns.loginTimer = setInterval(loginFuns.loopQuery, 3000)
							}
						})
					} else {
						nodes.loginswitch.innerHTML = getMSG("QRLOGIN");
						nodes.qrcodelogin.style.display = "none";
						nodes.commonlogin.style.display = "";
						nodes.qrimage.innerHTML = "";
						clearInterval(loginFuns.loginTimer);
						loginFuns.loginTimer
					}
				},
				loopCount: 0,
				loopQuery: function() {
					if (loginFuns.loopCount < 100) {
						$.core.io.ajax({
							url: "/oauth2/qrcode_authorize/query",
							args: {
								vcode: loginFuns.vcode
							},
							onComplete: function(ret) {
								switch (ret.status) {
								case "1":
									break;
								case "2":
									break;
								case "3":
									window.location.href = ret.url;
									break
								}
							}
						});
						loginFuns.loopCount++
					} else {
						loginFuns.loginswitch()
					}
				}
			};
			var autoResize = function() {
					var resizeList = "default,js,popup";
					if (display == 0 || resizeList.indexOf(display) != -1) {
						$.common.resize()
					}
				};
			var showHelpTip = function() {
					var help = sizzle(".icon_help")[0],
						msg = sizzle(".WB_tips_mini_w")[0];
					msg && (msg.style.display = "none");
					addEvent(help, "mouseover", function() {
						msg && (msg.style.display = "")
					});
					addEvent(help, "mouseout", function() {
						msg && (msg.style.display = "none")
					})
				};
			var showCloseTip = function() {
					var evt = $.core.evt.getEvent();
					evt.returnValue = getMSG("CLOSETIP")
				};
			var initPlugins = function() {
					if (nodes.userid) {
						tip = $.ui.simpleTip(nodes);
						nodes.userid.value = getMSG("LOGINMSG");
						nodes.userid.style.color = BLUR_COLOR;
						if (typeof $CONFIG != "undefined" && $CONFIG.$errorMsg) {
							tip.setContent($CONFIG.$errorMsg).show();
							loginFuns.getAllTabIndexObjects()
						}
					}
					if (acVal == "scope") {
						showHelpTip()
					}
					$.common.privacy(nodes, display);
					autoResize();
					if (nodes.userid) {
						placeHolder = $.common.placeholder(nodes.passwd, {
							force: true,
							text: getMSG("PASSWORD")
						})
					}
					if (document.body.innerHTML.indexOf("二维码登录") != -1) {}
					var switchLogin = $.E("switchLogin");
					if (switchLogin && switchLogin.value == "1") {
						loginFuns.loginswitch()
					}
				};
			var init = function() {
					argsCheck();
					parseDOM();
					bindDOM();
					initPlugins()
				};
			init()
		};
	initJs(document.body)
})();