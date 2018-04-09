exports.id = 0;
exports.modules = {

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.parsePage = parsePage;\nexports.options = options;\nexports.camelCase = camelCase;\nexports.meta = meta;\n\nvar _cheerio = __webpack_require__(10);\n\nvar _cheerio2 = _interopRequireDefault(_cheerio);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction parsePage(html) {\n  var $ = _cheerio2.default.load(html);\n  //let jss = [];\n  //$('script').each((i, el) => {\n  //  jss[i] = $(el);\n  //});\n\n  // 'window._sharedData'\n  return $('body script')[\"0\"].children[\"0\"].data.slice(22);\n}\n\nfunction options(html) {\n  var $ = _cheerio2.default.load(html);\n  var result = [];\n  $('#Datasets option').each(function (i, el) {\n    var id = $(el).val();\n    var title = $(el).html();\n    if (id === '-') return null;\n    return result.push({ id: id, title: title });\n  });\n  return result;\n}\n\nfunction camelCase(text) {\n  var result = text.replace(/\\(([a-zA-Z0-9_])\\)/gm, '$1').replace(/\\b/gm, ' ').split(' ').map(function (t) {\n    return '' + t.charAt(0).toUpperCase() + t.slice(1);\n  }).join(' ').replace(/[^a-zA-Z0-9_]/igm, '');\n  return '' + result.charAt(0).toLowerCase() + result.slice(1);\n}\n\nfunction meta(html) {\n  var $ = _cheerio2.default.load(html);\n  var title = '';\n  var result = {};\n  var tmp = [];\n  $('html body #bodymetadata .GroupDiv').each(function (i, el) {\n    title = $('.MetadataGroupTitle', el).text();\n    title = camelCase(title.trim());\n    result[title] = {};\n    $('.MetadataItemTitle', $('.MetadataGroupBlock', el).html()).each(function (j, elem) {\n      var item = $(elem).text();\n      item = camelCase(item.trim());\n      tmp[j] = item;\n    });\n    $('p', $('.MetadataItemBlock', el)).each(function (j, elem) {\n      var text = $(elem).text();\n      text = text.trim();\n      var item = tmp[j];\n      result[title][item] = text;\n    });\n  });\n  return result;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy91dGlscy9wYXJzZS5qcz83Mjg3Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucGFyc2VQYWdlID0gcGFyc2VQYWdlO1xuZXhwb3J0cy5vcHRpb25zID0gb3B0aW9ucztcbmV4cG9ydHMuY2FtZWxDYXNlID0gY2FtZWxDYXNlO1xuZXhwb3J0cy5tZXRhID0gbWV0YTtcblxudmFyIF9jaGVlcmlvID0gcmVxdWlyZSgnY2hlZXJpbycpO1xuXG52YXIgX2NoZWVyaW8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2hlZXJpbyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHBhcnNlUGFnZShodG1sKSB7XG4gIHZhciAkID0gX2NoZWVyaW8yLmRlZmF1bHQubG9hZChodG1sKTtcbiAgLy9sZXQganNzID0gW107XG4gIC8vJCgnc2NyaXB0JykuZWFjaCgoaSwgZWwpID0+IHtcbiAgLy8gIGpzc1tpXSA9ICQoZWwpO1xuICAvL30pO1xuXG4gIC8vICd3aW5kb3cuX3NoYXJlZERhdGEnXG4gIHJldHVybiAkKCdib2R5IHNjcmlwdCcpW1wiMFwiXS5jaGlsZHJlbltcIjBcIl0uZGF0YS5zbGljZSgyMik7XG59XG5cbmZ1bmN0aW9uIG9wdGlvbnMoaHRtbCkge1xuICB2YXIgJCA9IF9jaGVlcmlvMi5kZWZhdWx0LmxvYWQoaHRtbCk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgJCgnI0RhdGFzZXRzIG9wdGlvbicpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgdmFyIGlkID0gJChlbCkudmFsKCk7XG4gICAgdmFyIHRpdGxlID0gJChlbCkuaHRtbCgpO1xuICAgIGlmIChpZCA9PT0gJy0nKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0LnB1c2goeyBpZDogaWQsIHRpdGxlOiB0aXRsZSB9KTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNhbWVsQ2FzZSh0ZXh0KSB7XG4gIHZhciByZXN1bHQgPSB0ZXh0LnJlcGxhY2UoL1xcKChbYS16QS1aMC05X10pXFwpL2dtLCAnJDEnKS5yZXBsYWNlKC9cXGIvZ20sICcgJykuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gJycgKyB0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdC5zbGljZSgxKTtcbiAgfSkuam9pbignICcpLnJlcGxhY2UoL1teYS16QS1aMC05X10vaWdtLCAnJyk7XG4gIHJldHVybiAnJyArIHJlc3VsdC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHJlc3VsdC5zbGljZSgxKTtcbn1cblxuZnVuY3Rpb24gbWV0YShodG1sKSB7XG4gIHZhciAkID0gX2NoZWVyaW8yLmRlZmF1bHQubG9hZChodG1sKTtcbiAgdmFyIHRpdGxlID0gJyc7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgdmFyIHRtcCA9IFtdO1xuICAkKCdodG1sIGJvZHkgI2JvZHltZXRhZGF0YSAuR3JvdXBEaXYnKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgIHRpdGxlID0gJCgnLk1ldGFkYXRhR3JvdXBUaXRsZScsIGVsKS50ZXh0KCk7XG4gICAgdGl0bGUgPSBjYW1lbENhc2UodGl0bGUudHJpbSgpKTtcbiAgICByZXN1bHRbdGl0bGVdID0ge307XG4gICAgJCgnLk1ldGFkYXRhSXRlbVRpdGxlJywgJCgnLk1ldGFkYXRhR3JvdXBCbG9jaycsIGVsKS5odG1sKCkpLmVhY2goZnVuY3Rpb24gKGosIGVsZW0pIHtcbiAgICAgIHZhciBpdGVtID0gJChlbGVtKS50ZXh0KCk7XG4gICAgICBpdGVtID0gY2FtZWxDYXNlKGl0ZW0udHJpbSgpKTtcbiAgICAgIHRtcFtqXSA9IGl0ZW07XG4gICAgfSk7XG4gICAgJCgncCcsICQoJy5NZXRhZGF0YUl0ZW1CbG9jaycsIGVsKSkuZWFjaChmdW5jdGlvbiAoaiwgZWxlbSkge1xuICAgICAgdmFyIHRleHQgPSAkKGVsZW0pLnRleHQoKTtcbiAgICAgIHRleHQgPSB0ZXh0LnRyaW0oKTtcbiAgICAgIHZhciBpdGVtID0gdG1wW2pdO1xuICAgICAgcmVzdWx0W3RpdGxlXVtpdGVtXSA9IHRleHQ7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3V0aWxzL3BhcnNlLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///9\n");

/***/ })

};