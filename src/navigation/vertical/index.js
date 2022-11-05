/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
import dashboard from "./dashboard";
import basicSetting from "./basic-setting";
import cwieSetting from "./cwie-setting";
import cwieData from "./cwie-data";
import advisor from "./advisor";
import student from "./student";
import report from "./report";
import steacher from "./steacher";
import chairman from "./chairman";

import appsAndPages from "./apps-and-pages";
import others from "./others";
import chartsAndMaps from "./charts-and-maps";
import uiElements from "./ui-elements";
import formAndTable from "./forms-and-table";

// Array of sections
export default [
  ...dashboard,
  ...cwieData,
  ...advisor,
  ...chairman,
  ...steacher,
  ...student,
  ...report,
  ...cwieSetting,
  ...basicSetting,



  ...appsAndPages,
  ...uiElements,
  ...formAndTable,
  ...chartsAndMaps,
  ...others,
];
