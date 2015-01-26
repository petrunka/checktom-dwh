// Backbone.Validation v0.7.1
//
// Copyright (c) 2011-2012 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation
Backbone.Validation = function (e) {
    "use strict";
    var t = {forceUpdate: !1, selector: "name", labelFormatter: "sentenceCase", valid: Function.prototype, invalid: Function.prototype}, n = {formatLabel: function (e, n) {
        return a[t.labelFormatter](e, n)
    }, format: function () {
        var e = Array.prototype.slice.call(arguments), t = e.shift();
        return t.replace(/\{(\d+)\}/g, function (t, n) {
            return typeof e[n] != "undefined" ? e[n] : t
        })
    }}, r = function (t, n, i) {
        return n = n || {}, i = i || "", e.each(t, function (e, s) {
            t.hasOwnProperty(s) && (!e || typeof e != "object" || e instanceof Date || e instanceof RegExp ? n[i + s] = e : r(e, n, i + s + "."))
        }), n
    }, i = function () {
        var i = function (t) {
            return e.reduce(e.keys(t.validation || {}), function (e, t) {
                return e[t] = void 0, e
            }, {})
        }, o = function (t, n) {
            var r = t.validation ? t.validation[n] || {} : {};
            if (e.isFunction(r) || e.isString(r))r = {fn: r};
            return e.isArray(r) || (r = [r]), e.reduce(r, function (t, n) {
                return e.each(e.without(e.keys(n), "msg"), function (e) {
                    t.push({fn: f[e], val: n[e], msg: n.msg})
                }), t
            }, [])
        }, u = function (t, r, i, s) {
            return e.reduce(o(t, r), function (o, u) {
                var a = e.extend({}, n, f), l = u.fn.call(a, i, r, u.val, t, s);
                return l === !1 || o === !1 ? !1 : l && !o ? u.msg || l : o
            }, "")
        }, a = function (t, n) {
            var i, s = {}, o = !0, a = e.clone(n), f = r(n);
            return e.each(f, function (e, n) {
                i = u(t, n, e, a), i && (s[n] = i, o = !1)
            }), {invalidAttrs: s, isValid: o}
        }, l = function (t, n) {
            return{preValidate: function (t, n) {
                return u(this, t, n, e.extend({}, this.attributes))
            }, isValid: function (t) {
                var n = r(this.attributes);
                return e.isString(t) ? !u(this, t, n[t], e.extend({}, this.attributes)) : e.isArray(t) ? e.reduce(t, function (t, r) {
                    return t && !u(this, r, n[r], e.extend({}, this.attributes))
                }, !0, this) : (t === !0 && this.validate(), this.validation ? this._isValid : !0)
            }, validate: function (s, o) {
                var u = this, f = !s, l = e.extend({}, n, o), c = i(u), h = e.extend({}, c, u.attributes, s), p = r(s || h), d = a(u, h);
                u._isValid = d.isValid, e.each(c, function (e, n) {
                    var r = d.invalidAttrs.hasOwnProperty(n);
                    r || l.valid(t, n, l.selector)
                }), e.each(c, function (e, n) {
                    var r = d.invalidAttrs.hasOwnProperty(n), i = p.hasOwnProperty(n);
                    r && (i || f) && l.invalid(t, n, d.invalidAttrs[n], l.selector)
                }), e.defer(function () {
                    u.trigger("validated", u._isValid, u, d.invalidAttrs), u.trigger("validated:" + (u._isValid ? "valid" : "invalid"), u, d.invalidAttrs)
                });
                if (!l.forceUpdate && e.intersection(e.keys(d.invalidAttrs), e.keys(p)).length > 0)return d.invalidAttrs
            }}
        }, c = function (t, n, r) {
            e.extend(n, l(t, r))
        }, h = function (e) {
            delete e.validate, delete e.preValidate, delete e.isValid
        }, p = function (e) {
            c(this.view, e, this.options)
        }, d = function (e) {
            h(e)
        };
        return{version: "0.7.1", configure: function (n) {
            e.extend(t, n)
        }, bind: function (n, r) {
            var i = n.model, o = n.collection;
            r = e.extend({}, t, s, r);
            if (typeof i == "undefined" && typeof o == "undefined")throw"Before you execute the binding your view must have a model or a collection.\nSee http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.";
            i ? c(n, i, r) : o && (o.each(function (e) {
                c(n, e, r)
            }), o.bind("add", p, {view: n, options: r}), o.bind("remove", d))
        }, unbind: function (e) {
            var t = e.model, n = e.collection;
            t && h(e.model), n && (n.each(function (e) {
                h(e)
            }), n.unbind("add", p), n.unbind("remove", d))
        }, mixin: l(null, t)}
    }(), s = i.callbacks = {valid: function (e, t, n) {
        e.$("[" + n + '~="' + t + '"]').removeClass("invalid").removeAttr("data-error")
    }, invalid: function (e, t, n, r) {
        e.$("[" + r + '~="' + t + '"]').addClass("invalid").attr("data-error", n)
    }}, o = i.patterns = {digits: /^\d+$/, number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/, email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i}, u = i.messages = {required: "{0} is required", acceptance: "{0} must be accepted", min: "{0} must be greater than or equal to {1}", max: "{0} must be less than or equal to {1}", range: "{0} must be between {1} and {2}", length: "{0} must be {1} characters", minLength: "{0} must be at least {1} characters", maxLength: "{0} must be at most {1} characters", rangeLength: "{0} must be between {1} and {2} characters", oneOf: "{0} must be one of: {1}", equalTo: "{0} must be the same as {1}", pattern: "{0} must be a valid {1}"}, a = i.labelFormatters = {none: function (e) {
        return e
    }, sentenceCase: function (e) {
        return e.replace(/(?:^\w|[A-Z]|\b\w)/g,function (e, t) {
            return t === 0 ? e.toUpperCase() : " " + e.toLowerCase()
        }).replace("_", " ")
    }, label: function (e, t) {
        return t.labels && t.labels[e] || a.sentenceCase(e, t)
    }}, f = i.validators = function () {
        var t = String.prototype.trim ? function (e) {
            return e === null ? "" : String.prototype.trim.call(e)
        } : function (e) {
            var t = /^\s+/, n = /\s+$/;
            return e === null ? "" : e.toString().replace(t, "").replace(n, "")
        }, n = function (t) {
            return e.isNumber(t) || e.isString(t) && t.match(o.number)
        }, r = function (n) {
            return!(e.isNull(n) || e.isUndefined(n) || e.isString(n) && t(n) === "")
        };
        return{fn: function (t, n, r, i, s) {
            return e.isString(r) && (r = i[r]), r.call(i, t, n, s)
        }, required: function (t, n, i, s, o) {
            var a = e.isFunction(i) ? i.call(s, t, n, o) : i;
            if (!a && !r(t))return!1;
            if (a && !r(t))return this.format(u.required, this.formatLabel(n, s))
        }, acceptance: function (t, n, r, i) {
            if (t !== "true" && (!e.isBoolean(t) || t === !1))return this.format(u.acceptance, this.formatLabel(n, i))
        }, min: function (e, t, r, i) {
            if (!n(e) || e < r)return this.format(u.min, this.formatLabel(t, i), r)
        }, max: function (e, t, r, i) {
            if (!n(e) || e > r)return this.format(u.max, this.formatLabel(t, i), r)
        }, range: function (e, t, r, i) {
            if (!n(e) || e < r[0] || e > r[1])return this.format(u.range, this.formatLabel(t, i), r[0], r[1])
        }, length: function (e, n, i, s) {
            if (!r(e) || t(e).length !== i)return this.format(u.length, this.formatLabel(n, s), i)
        }, minLength: function (e, n, i, s) {
            if (!r(e) || t(e).length < i)return this.format(u.minLength, this.formatLabel(n, s), i)
        }, maxLength: function (e, n, i, s) {
            if (!r(e) || t(e).length > i)return this.format(u.maxLength, this.formatLabel(n, s), i)
        }, rangeLength: function (e, n, i, s) {
            if (!r(e) || t(e).length < i[0] || t(e).length > i[1])return this.format(u.rangeLength, this.formatLabel(n, s), i[0], i[1])
        }, oneOf: function (t, n, r, i) {
            if (!e.include(r, t))return this.format(u.oneOf, this.formatLabel(n, i), r.join(", "))
        }, equalTo: function (e, t, n, r, i) {
            if (e !== i[n])return this.format(u.equalTo, this.formatLabel(t, r), this.formatLabel(n, r))
        }, pattern: function (e, t, n, i) {
            if (!r(e) || !e.toString().match(o[n] || n))return this.format(u.pattern, this.formatLabel(t, i), n)
        }}
    }();
    return i
}(_);