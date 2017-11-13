<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Bookmarklet {{version}}</title>
	<style>
		body {
			font:  bold 3vw/1.4 "Helvetica Neue", Helvetica, Arial;
			padding:  40px;
			padding:  20vmin;
			text-align: center;
		}
    h1 {
      font-size: 5vw;
    }
		.emoticon {
			font: caption;
			font-size:  5vw;
		}
		a {
      font-size: 5vw;
			text-decoration: none;
			border:  1px solid;
			padding: 5px 8px;
			border-radius: .2ex;
		}
	</style>
</head>
<body>
  <h1>See the headings like a screenreader</h1>
	<p>
		Add one of those goodies to your bookmarks:
		<br><br>
		<a href="javascript:(function(){function%20getOutlineAsHTML()%7Bfor(var%20e%3D0%2Ct%3D0%2Ci%3Ddocument.querySelectorAll('h1%2Ch2%2Ch3%2Ch4%2Ch5%2Ch6%2Ch7%2C%5Brole%3D%22heading%22%5D')%2Co%3D%22%22%2Cn%3D0%3Bn%3Ci.length%3Bn%2B%2B)%7Bvar%20l%3Di%5Bn%5D%2Cr%3DisVisible(i%5Bn%5D)%2Ca%3DparseInt(%22heading%22%3D%3Dl.getAttribute(%22role%22)%26%26l.getAttribute(%22aria-level%22)%7C%7Cl.nodeName.substr(1))%3Bif(r)%7Bvar%20d%3Da%3Et%26%26a!%3D%3Dt%2B1%3Bt%3Da%7Delse%20d%3D!1%3Bvar%20s%3Dl.id%7C%7C%22h5o-heading-%22%2B%20%2B%2Be%3Bl.id%3Ds%3Bvar%20h%3D'%3Cspan%20class%3D%22level%22%20data-level%3D%22'%2Ba%2B'%22%3E%3C%2Fspan%3E%20'%2BhtmlEntities(l.textContent.replace(%2F%5Cs%2B%2Fg%2C%22%20%22))%3Bo%2B%3D'%3Cli%20class%3D%22'%2Co%2B%3Dd%3F%22wrong-level%22%3A%22correct-level%22%2Co%2B%3Dr%3F%22%22%3A%22%20hidden%22%2Co%2B%3Dr%26%26isVisuallyHidden(l)%3F%22%20visuallyhidden%22%3A%22%22%2Co%2B%3D'%22%20style%3D%22margin-left%3A%20'%2Ba%2B'em%3B%22%3E'%2Co%2B%3D'%3Ca%20href%3D%22%23'%2Bs%2B'%22%20target%3D%22_top%22%3E'%2Bh%2B%22%3C%2Fa%3E%22%2Co%2B%3D%22%3C%2Fli%3E%22%7Dreturn%22%3Cul%3E%22%2Bo%2B%22%3C%2Ful%3E%22%7Dfunction%20htmlEntities(e)%7Breturn%20String(e).replace(%2F%26%2Fg%2C%22%26amp%3B%22).replace(%2F%3C%2Fg%2C%22%26lt%3B%22).replace(%2F%3E%2Fg%2C%22%26gt%3B%22).replace(%2F%22%2Fg%2C%22%26quot%3B%22)%7Dfunction%20isVisible(e)%7Bfor(var%20t%3Dwindow.getComputedStyle(e)%2Ci%3D!1%3Be%3B)%7Bif(%22none%22%3D%3D%3Dt.display)return!1%3Bif(!i)%7Bif(%22hidden%22%3D%3D%3Dt.visibility)return!1%3B%22visible%22%3D%3D%3Dt.visibility%26%26(i%3D!0)%7Dif(%22true%22%3D%3D%3De.getAttribute(%22aria-hidden%22))return!1%3Be%3De.parentElement%3Btry%7Bt%3Dwindow.getComputedStyle(e)%7Dcatch(e)%7Breturn!0%7D%7Dreturn!0%7Dfunction%20isVisuallyHidden(e)%7Bvar%20t%3De.getBoundingClientRect(e)%3Bif(%22absolute%22%3D%3D%3Dwindow.getComputedStyle(e).position)%7Bif(t.width%3C%3D1%26%26t.height%3C%3D1)return!0%3Bif(t.right%3C%3D0)return!0%7D%7Dfunction%20highlightElement(e)%7Be.scrollIntoViewIfNeeded%3Fe.scrollIntoViewIfNeeded()%3Ae.scrollIntoView%26%26e.scrollIntoView()%2CsetTimeout(function()%7Bfor(var%20t%3De.getBoundingClientRect()%2Ci%3De.parentElement%3B!t.height%26%26!t.width%26%26!t.left%26%26!t.top%26%26i%3B)t%3Di.getBoundingClientRect()%2C!1%2Ci%3Di.parentElement%3Bi%26%26((t%3D%7Bleft%3At.left%2Ctop%3At.top%2Cbottom%3At.bottom%2Cright%3At.right%7D).left%3DMath.min(window.innerWidth%2Ct.left)%2Ct.right%3DMath.max(0%2Ct.right)%2Ct.top%3DMath.min(window.innerHeight%2Ct.top)%2Ct.bottom%3DMath.max(0%2Ct.bottom)%2Cdocument.getElementById(highlighterEl.id)%7C%7Cdocument.body.appendChild(highlighterEl)%2ChighlighterEl.style.left%3Dt.left-10%2B%22px%22%2ChighlighterEl.style.width%3Dt.right-t.left%2B20%2B%22px%22%2ChighlighterEl.style.top%3Dt.top-10%2B%22px%22%2ChighlighterEl.style.height%3Dt.bottom-t.top%2B20%2B%22px%22%2ChighlighterEl.style.display%3D%22block%22)%7D%2C100)%7Dvar%20containerId%3D%22a11y-bookmarklet%22%2CcontainerStyle%3D%22position%3A%20fixed%3B%20top%3A%200%3B%20right%3A%200%3B%20bottom%3A%200%3B%20box-shadow%3A%200%200%2080px%20rgba(0%2C0%2C0%2C0.3)%3B%20width%3A%2020%25%3B%20min-width%3A%20280px%3B%20max-width%3A%20450px%3B%20z-index%3A%201000000%3B%22%2ChighlighterEl%3Ddocument.createElement(%22DIV%22)%3BhighlighterEl.id%3D%22h1-a11y-highlighterelement%22%2ChighlighterEl.style.cssText%3D%22pointer-events%3A%20none%3B%20position%3A%20fixed%3B%20border%3A%201px%20dashed%20%230081BE%3B%20box-shadow%3A%200%200%2054px%200%20rgba(0%2C84%2C150%2C0.3)%3B%20display%3A%20none%3B%20z-index%3A%201000000%3B%20transition%3A%20all%20200ms%3B%22%3Bvar%20container%3Ddocument.getElementById(containerId)%3Bcontainer%26%26document.body.removeChild(container)%2C(container%3Ddocument.createElement(%22DIV%22)).id%3DcontainerId%2Ccontainer.style.cssText%3DcontainerStyle%3Bvar%20iframe%3Ddocument.createElement(%22IFRAME%22)%3Biframe.style.width%3D%22100%25%22%2Ciframe.style.height%3D%22100%25%22%2Ciframe.style.borderWidth%3D%220%22%2Ccontainer.appendChild(iframe)%2Ciframe.onload%3Dfunction()%7Bfunction%20e(e%2Ci)%7Bvar%20o%3Dt.getElementById(e)%2Cn%3Dt.querySelector(%22.result%22)%3Bif(o)%7Bvar%20l%3Dfunction(e)%7Bo.checked%3Fn.classList.add(i)%3An.classList.remove(i)%7D%3Bo.addEventListener(%22change%22%2Cl%2C!1)%2Co.addEventListener(%22click%22%2Cl%2C!1)%2Cl()%7D%7Diframe.onload%3Dfunction()%7B%7D%3Bvar%20t%3Diframe.contentWindow.document%3Bt.open()%2Ct.write('%3Chtml%3E%20%3Chead%3E%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2Cminimum-scale%3D1.0%2Cinitial-scale%3D1%2Cuser-scalable%3Dyes%22%3E%20%3Cstyle%3E*%20%7B%20margin%3A%200%3B%20padding%3A%200%3B%20border%3A%200%3B%20%7D%20body%20%7B%20padding%3A%200%3B%20margin%3A%200%3B%20font%3A%2014px%2F1.6%20%22Helvetica%20Neue%22%2C%20Helvetica%2C%20Arial%2C%20sans%3B%20font%3A%20caption%3B%20line-height%3A%201.6%3B%20color%3A%20%23284900%3B%20background%3A%20rgba(255%2C255%2C255%2C0.95)%3B%20%7D%20body%20%7B%20white-space%3A%20nowrap%3B%20overflow-x%3A%20hidden%3B%20text-overflow%3A%20ellipsis%3B%20padding%3A%2015px%3B%20%7D%20ul%20%7B%20margin%3A%200%200%200%20-10px%3B%20padding%3A%200%3B%20%7D%20li%20%7B%20color%3A%20%23284900%3B%20list-style%3A%20none%3B%20margin-left%3A%2020px%3B%20margin-bottom%3A%204px%3B%20%7D%20a%20%7B%20color%3A%20inherit%3B%20text-decoration%3A%20none%3B%20display%3A%20block%3B%20max-width%3A%2030em%3B%20overflow%3A%20hidden%3B%20text-overflow%3A%20ellipsis%3B%20padding-left%3A%2023px%3B%20position%3A%20relative%3B%20line-height%3A%201.3%3B%20%7D%20a%20%3E%20.level%20%7B%20display%3A%20inline-block%3B%20background-color%3A%20currentColor%3B%20font-size%3A%2085%25%3B%20font-weight%3A%20bold%3B%20width%3A%202.7ex%3B%20height%3A%202.7ex%3B%20text-align%3A%20center%3B%20-webkit-box-sizing%3A%20border-box%3B%20box-sizing%3A%20border-box%3B%20position%3A%20absolute%3B%20left%3A%200%3B%20top%3A%200px%3B%20padding-top%3A%201px%3B%20%7D%20a%20%3E%20.level%3Abefore%20%7B%20content%3A%20attr(data-level)%3B%20color%3A%20white%3B%20%7D%20li.hidden%20%7B%20color%3A%20black%3B%20text-decoration%3A%20line-through%3B%20opacity%3A%200.5%3B%20%7D%20.result%3Anot(.show-hidden)%20li.hidden%20%7B%20display%3A%20none%3B%20%7D%20.result.mark-visuallyhidden%20li.visuallyhidden%20.level%3Abefore%20%7B%20color%3A%20inherit%3B%20%7D%20.result.mark-visuallyhidden%20li.visuallyhidden%20.level%20%7B%20border%3A%201px%20dashed%3B%20background%3A%20white%3B%20%7D%20li.wrong-level%20%7B%20color%3A%20%23AF3A37%3B%20%7D%20a%3Ahover%20%7B%20background-color%3A%20%23284900%3B%20color%3A%20white%3B%20%7D%20a%3Ahover%20%3E%20.level%20%7B%20background-color%3A%20transparent%3B%20%7D%20header%20%7B%20padding-top%3A%205px%3B%20padding-bottom%3A%2015px%3B%20padding-right%3A%205em%3B%20margin-bottom%3A%201em%3B%20border-bottom%3A%201px%20solid%20%23eee%3B%20%7D%20legend%20%7B%20float%3A%20left%3B%20margin-right%3A%201em%3B%20font-weight%3A%20bold%3B%20%7D%20.options%20%7B%20display%3A%20-webkit-box%3B%20display%3A%20-ms-flexbox%3B%20display%3A%20flex%3B%20-ms-flex-wrap%3A%20wrap%3B%20flex-wrap%3A%20wrap%3B%20%7D%20.options%20.input%20%7B%20margin-right%3A%202em%3B%20%7D%20.tooltip%20%7B%20position%3A%20relative%3B%20%7D%20.tooltip%3Abefore%20%7B%20content%3A%20%5C'%E2%84%B9%EF%B8%8F%5C'%3B%20%7D%20.tooltip%3Afocus%3Aafter%2C%20.tooltip%3Ahover%3Aafter%20%7B%20content%3A%20attr(title)%3B%20position%3A%20absolute%3B%20background%3A%20white%3B%20padding%3A%204px%2010px%3B%20top%3A%2070%25%3B%20left%3A%2070%25%3B%20width%3A%2010em%3B%20-webkit-box-shadow%3A%200%202px%2020px%20rgba(0%2C0%2C0%2C0.3)%3B%20box-shadow%3A%200%202px%2020px%20rgba(0%2C0%2C0%2C0.3)%3B%20white-space%3A%20normal%3B%20border-radius%3A%208px%3B%20border-top-left-radius%3A%200%3B%20z-index%3A%201%3B%20pointer-events%3A%20none%3B%20%7D%20.button-close%20%7B%20position%3A%20absolute%3B%20top%3A%2015px%3B%20right%3A%2015px%3B%20padding%3A%205px%2010px%3B%20border-radius%3A%205px%3B%20border%3A%200%3B%20font-size%3A%20inherit%3B%20color%3A%20white%3B%20background-color%3A%20%23284900%3B%20cursor%3A%20pointer%3B%20%7D%20.button-close%3Ahover%20%7B%20color%3A%20white%3B%20background-color%3A%20%23284900%3B%20%7D%20%3C%2Fstyle%3E%20%3C%2Fhead%3E%20%3Cbody%3E%20%3Cheader%3E%20%3Cbutton%20class%3D%22button-close%22%20data-action%3D%22close%22%3EClose%3C%2Fbutton%3E%20%3Cfieldset%3E%20%3Clegend%3EOptions%3C%2Flegend%3E%20%3Cdiv%20class%3D%22options%22%3E%20%3Cdiv%20class%3D%22input%22%3E%20%3Cinput%20type%3D%22checkbox%22%20name%3D%22options%22%20id%3D%22o-hidden%22%3E%20%3Clabel%20for%3D%22o-hidden%22%3EShow%20hidden%20%3Cspan%20class%3D%22tooltip%22%20title%3D%22also%20hidden%20for%20screenreaders%22%20tabindex%3D%220%22%3E%3C%2Fspan%3E%3C%2Flabel%3E%20%3C%2Fdiv%3E%20%3Cdiv%20class%3D%22input%22%3E%20%3Cinput%20type%3D%22checkbox%22%20name%3D%22options%22%20id%3D%22o-visuallyhidden%22%3E%20%3Clabel%20for%3D%22o-visuallyhidden%22%3EMark%20visually%20hidden%20%3Cspan%20class%3D%22tooltip%22%20title%3D%22only%20visible%20for%20screenreaders%22%20tabindex%3D%220%22%3E%3C%2Fspan%3E%3C%2Flabel%3E%20%3C%2Fdiv%3E%20%3C%2Fdiv%3E%20%3C%2Ffieldset%3E%20%3C%2Fheader%3E%20%3Cmain%20id%3D%22result%22%20class%3D%22result%22%3E%20%3C%2Fmain%3E%20%3C%2Fbody%3E%20%3C%2Fhtml%3E%20')%2Ct.close()%3Bvar%20i%3Dt.querySelector('%5Bdata-action%3D%22close%22%5D')%3Bi%26%26i.addEventListener(%22click%22%2Cfunction(e)%7Bdocument.body.removeChild(container)%2Cdocument.getElementById(highlighterEl.id)%26%26document.body.removeChild(highlighterEl)%7D)%3Bvar%20o%3Dt.querySelector(%22%23result%22)%3Bo%26%26(o.innerHTML%3DgetOutlineAsHTML())%2Ce(%22o-hidden%22%2C%22show-hidden%22)%2Ce(%22o-visuallyhidden%22%2C%22mark-visuallyhidden%22)%2Ct.addEventListener(%22mouseover%22%2Cfunction(e)%7Bvar%20t%3Bif(%22A%22%3D%3D%3De.target.nodeName.toUpperCase()%3Ft%3De.target%3Ae.target.parentElement%26%26%22A%22%3D%3D%3De.target.parentElement.nodeName.toUpperCase()%26%26(t%3De.target.parentElement)%2Ct)%7Bconsole.log(%22Link%22%2Ct)%3Bvar%20i%3Ddocument.querySelector(t.getAttribute(%22href%22))%3Bconsole.log(%22Target%22%2Ci)%2ChighlightElement(i)%7D%7D%2C!1)%7D%2Cdocument.body.appendChild(container)%3B}())">Show Headings</a>
		<br><br>
		<a class="emoticon" href="javascript:(function(){function%20getOutlineAsHTML()%7Bfor(var%20e%3D0%2Ct%3D0%2Ci%3Ddocument.querySelectorAll('h1%2Ch2%2Ch3%2Ch4%2Ch5%2Ch6%2Ch7%2C%5Brole%3D%22heading%22%5D')%2Co%3D%22%22%2Cn%3D0%3Bn%3Ci.length%3Bn%2B%2B)%7Bvar%20l%3Di%5Bn%5D%2Cr%3DisVisible(i%5Bn%5D)%2Ca%3DparseInt(%22heading%22%3D%3Dl.getAttribute(%22role%22)%26%26l.getAttribute(%22aria-level%22)%7C%7Cl.nodeName.substr(1))%3Bif(r)%7Bvar%20d%3Da%3Et%26%26a!%3D%3Dt%2B1%3Bt%3Da%7Delse%20d%3D!1%3Bvar%20s%3Dl.id%7C%7C%22h5o-heading-%22%2B%20%2B%2Be%3Bl.id%3Ds%3Bvar%20h%3D'%3Cspan%20class%3D%22level%22%20data-level%3D%22'%2Ba%2B'%22%3E%3C%2Fspan%3E%20'%2BhtmlEntities(l.textContent.replace(%2F%5Cs%2B%2Fg%2C%22%20%22))%3Bo%2B%3D'%3Cli%20class%3D%22'%2Co%2B%3Dd%3F%22wrong-level%22%3A%22correct-level%22%2Co%2B%3Dr%3F%22%22%3A%22%20hidden%22%2Co%2B%3Dr%26%26isVisuallyHidden(l)%3F%22%20visuallyhidden%22%3A%22%22%2Co%2B%3D'%22%20style%3D%22margin-left%3A%20'%2Ba%2B'em%3B%22%3E'%2Co%2B%3D'%3Ca%20href%3D%22%23'%2Bs%2B'%22%20target%3D%22_top%22%3E'%2Bh%2B%22%3C%2Fa%3E%22%2Co%2B%3D%22%3C%2Fli%3E%22%7Dreturn%22%3Cul%3E%22%2Bo%2B%22%3C%2Ful%3E%22%7Dfunction%20htmlEntities(e)%7Breturn%20String(e).replace(%2F%26%2Fg%2C%22%26amp%3B%22).replace(%2F%3C%2Fg%2C%22%26lt%3B%22).replace(%2F%3E%2Fg%2C%22%26gt%3B%22).replace(%2F%22%2Fg%2C%22%26quot%3B%22)%7Dfunction%20isVisible(e)%7Bfor(var%20t%3Dwindow.getComputedStyle(e)%2Ci%3D!1%3Be%3B)%7Bif(%22none%22%3D%3D%3Dt.display)return!1%3Bif(!i)%7Bif(%22hidden%22%3D%3D%3Dt.visibility)return!1%3B%22visible%22%3D%3D%3Dt.visibility%26%26(i%3D!0)%7Dif(%22true%22%3D%3D%3De.getAttribute(%22aria-hidden%22))return!1%3Be%3De.parentElement%3Btry%7Bt%3Dwindow.getComputedStyle(e)%7Dcatch(e)%7Breturn!0%7D%7Dreturn!0%7Dfunction%20isVisuallyHidden(e)%7Bvar%20t%3De.getBoundingClientRect(e)%3Bif(%22absolute%22%3D%3D%3Dwindow.getComputedStyle(e).position)%7Bif(t.width%3C%3D1%26%26t.height%3C%3D1)return!0%3Bif(t.right%3C%3D0)return!0%7D%7Dfunction%20highlightElement(e)%7Be.scrollIntoViewIfNeeded%3Fe.scrollIntoViewIfNeeded()%3Ae.scrollIntoView%26%26e.scrollIntoView()%2CsetTimeout(function()%7Bfor(var%20t%3De.getBoundingClientRect()%2Ci%3De.parentElement%3B!t.height%26%26!t.width%26%26!t.left%26%26!t.top%26%26i%3B)t%3Di.getBoundingClientRect()%2C!1%2Ci%3Di.parentElement%3Bi%26%26((t%3D%7Bleft%3At.left%2Ctop%3At.top%2Cbottom%3At.bottom%2Cright%3At.right%7D).left%3DMath.min(window.innerWidth%2Ct.left)%2Ct.right%3DMath.max(0%2Ct.right)%2Ct.top%3DMath.min(window.innerHeight%2Ct.top)%2Ct.bottom%3DMath.max(0%2Ct.bottom)%2Cdocument.getElementById(highlighterEl.id)%7C%7Cdocument.body.appendChild(highlighterEl)%2ChighlighterEl.style.left%3Dt.left-10%2B%22px%22%2ChighlighterEl.style.width%3Dt.right-t.left%2B20%2B%22px%22%2ChighlighterEl.style.top%3Dt.top-10%2B%22px%22%2ChighlighterEl.style.height%3Dt.bottom-t.top%2B20%2B%22px%22%2ChighlighterEl.style.display%3D%22block%22)%7D%2C100)%7Dvar%20containerId%3D%22a11y-bookmarklet%22%2CcontainerStyle%3D%22position%3A%20fixed%3B%20top%3A%200%3B%20right%3A%200%3B%20bottom%3A%200%3B%20box-shadow%3A%200%200%2080px%20rgba(0%2C0%2C0%2C0.3)%3B%20width%3A%2020%25%3B%20min-width%3A%20280px%3B%20max-width%3A%20450px%3B%20z-index%3A%201000000%3B%22%2ChighlighterEl%3Ddocument.createElement(%22DIV%22)%3BhighlighterEl.id%3D%22h1-a11y-highlighterelement%22%2ChighlighterEl.style.cssText%3D%22pointer-events%3A%20none%3B%20position%3A%20fixed%3B%20border%3A%201px%20dashed%20%230081BE%3B%20box-shadow%3A%200%200%2054px%200%20rgba(0%2C84%2C150%2C0.3)%3B%20display%3A%20none%3B%20z-index%3A%201000000%3B%20transition%3A%20all%20200ms%3B%22%3Bvar%20container%3Ddocument.getElementById(containerId)%3Bcontainer%26%26document.body.removeChild(container)%2C(container%3Ddocument.createElement(%22DIV%22)).id%3DcontainerId%2Ccontainer.style.cssText%3DcontainerStyle%3Bvar%20iframe%3Ddocument.createElement(%22IFRAME%22)%3Biframe.style.width%3D%22100%25%22%2Ciframe.style.height%3D%22100%25%22%2Ciframe.style.borderWidth%3D%220%22%2Ccontainer.appendChild(iframe)%2Ciframe.onload%3Dfunction()%7Bfunction%20e(e%2Ci)%7Bvar%20o%3Dt.getElementById(e)%2Cn%3Dt.querySelector(%22.result%22)%3Bif(o)%7Bvar%20l%3Dfunction(e)%7Bo.checked%3Fn.classList.add(i)%3An.classList.remove(i)%7D%3Bo.addEventListener(%22change%22%2Cl%2C!1)%2Co.addEventListener(%22click%22%2Cl%2C!1)%2Cl()%7D%7Diframe.onload%3Dfunction()%7B%7D%3Bvar%20t%3Diframe.contentWindow.document%3Bt.open()%2Ct.write('%3Chtml%3E%20%3Chead%3E%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2Cminimum-scale%3D1.0%2Cinitial-scale%3D1%2Cuser-scalable%3Dyes%22%3E%20%3Cstyle%3E*%20%7B%20margin%3A%200%3B%20padding%3A%200%3B%20border%3A%200%3B%20%7D%20body%20%7B%20padding%3A%200%3B%20margin%3A%200%3B%20font%3A%2014px%2F1.6%20%22Helvetica%20Neue%22%2C%20Helvetica%2C%20Arial%2C%20sans%3B%20font%3A%20caption%3B%20line-height%3A%201.6%3B%20color%3A%20%23284900%3B%20background%3A%20rgba(255%2C255%2C255%2C0.95)%3B%20%7D%20body%20%7B%20white-space%3A%20nowrap%3B%20overflow-x%3A%20hidden%3B%20text-overflow%3A%20ellipsis%3B%20padding%3A%2015px%3B%20%7D%20ul%20%7B%20margin%3A%200%200%200%20-10px%3B%20padding%3A%200%3B%20%7D%20li%20%7B%20color%3A%20%23284900%3B%20list-style%3A%20none%3B%20margin-left%3A%2020px%3B%20margin-bottom%3A%204px%3B%20%7D%20a%20%7B%20color%3A%20inherit%3B%20text-decoration%3A%20none%3B%20display%3A%20block%3B%20max-width%3A%2030em%3B%20overflow%3A%20hidden%3B%20text-overflow%3A%20ellipsis%3B%20padding-left%3A%2023px%3B%20position%3A%20relative%3B%20line-height%3A%201.3%3B%20%7D%20a%20%3E%20.level%20%7B%20display%3A%20inline-block%3B%20background-color%3A%20currentColor%3B%20font-size%3A%2085%25%3B%20font-weight%3A%20bold%3B%20width%3A%202.7ex%3B%20height%3A%202.7ex%3B%20text-align%3A%20center%3B%20-webkit-box-sizing%3A%20border-box%3B%20box-sizing%3A%20border-box%3B%20position%3A%20absolute%3B%20left%3A%200%3B%20top%3A%200px%3B%20padding-top%3A%201px%3B%20%7D%20a%20%3E%20.level%3Abefore%20%7B%20content%3A%20attr(data-level)%3B%20color%3A%20white%3B%20%7D%20li.hidden%20%7B%20color%3A%20black%3B%20text-decoration%3A%20line-through%3B%20opacity%3A%200.5%3B%20%7D%20.result%3Anot(.show-hidden)%20li.hidden%20%7B%20display%3A%20none%3B%20%7D%20.result.mark-visuallyhidden%20li.visuallyhidden%20.level%3Abefore%20%7B%20color%3A%20inherit%3B%20%7D%20.result.mark-visuallyhidden%20li.visuallyhidden%20.level%20%7B%20border%3A%201px%20dashed%3B%20background%3A%20white%3B%20%7D%20li.wrong-level%20%7B%20color%3A%20%23AF3A37%3B%20%7D%20a%3Ahover%20%7B%20background-color%3A%20%23284900%3B%20color%3A%20white%3B%20%7D%20a%3Ahover%20%3E%20.level%20%7B%20background-color%3A%20transparent%3B%20%7D%20header%20%7B%20padding-top%3A%205px%3B%20padding-bottom%3A%2015px%3B%20padding-right%3A%205em%3B%20margin-bottom%3A%201em%3B%20border-bottom%3A%201px%20solid%20%23eee%3B%20%7D%20legend%20%7B%20float%3A%20left%3B%20margin-right%3A%201em%3B%20font-weight%3A%20bold%3B%20%7D%20.options%20%7B%20display%3A%20-webkit-box%3B%20display%3A%20-ms-flexbox%3B%20display%3A%20flex%3B%20-ms-flex-wrap%3A%20wrap%3B%20flex-wrap%3A%20wrap%3B%20%7D%20.options%20.input%20%7B%20margin-right%3A%202em%3B%20%7D%20.tooltip%20%7B%20position%3A%20relative%3B%20%7D%20.tooltip%3Abefore%20%7B%20content%3A%20%5C'%E2%84%B9%EF%B8%8F%5C'%3B%20%7D%20.tooltip%3Afocus%3Aafter%2C%20.tooltip%3Ahover%3Aafter%20%7B%20content%3A%20attr(title)%3B%20position%3A%20absolute%3B%20background%3A%20white%3B%20padding%3A%204px%2010px%3B%20top%3A%2070%25%3B%20left%3A%2070%25%3B%20width%3A%2010em%3B%20-webkit-box-shadow%3A%200%202px%2020px%20rgba(0%2C0%2C0%2C0.3)%3B%20box-shadow%3A%200%202px%2020px%20rgba(0%2C0%2C0%2C0.3)%3B%20white-space%3A%20normal%3B%20border-radius%3A%208px%3B%20border-top-left-radius%3A%200%3B%20z-index%3A%201%3B%20pointer-events%3A%20none%3B%20%7D%20.button-close%20%7B%20position%3A%20absolute%3B%20top%3A%2015px%3B%20right%3A%2015px%3B%20padding%3A%205px%2010px%3B%20border-radius%3A%205px%3B%20border%3A%200%3B%20font-size%3A%20inherit%3B%20color%3A%20white%3B%20background-color%3A%20%23284900%3B%20cursor%3A%20pointer%3B%20%7D%20.button-close%3Ahover%20%7B%20color%3A%20white%3B%20background-color%3A%20%23284900%3B%20%7D%20%3C%2Fstyle%3E%20%3C%2Fhead%3E%20%3Cbody%3E%20%3Cheader%3E%20%3Cbutton%20class%3D%22button-close%22%20data-action%3D%22close%22%3EClose%3C%2Fbutton%3E%20%3Cfieldset%3E%20%3Clegend%3EOptions%3C%2Flegend%3E%20%3Cdiv%20class%3D%22options%22%3E%20%3Cdiv%20class%3D%22input%22%3E%20%3Cinput%20type%3D%22checkbox%22%20name%3D%22options%22%20id%3D%22o-hidden%22%3E%20%3Clabel%20for%3D%22o-hidden%22%3EShow%20hidden%20%3Cspan%20class%3D%22tooltip%22%20title%3D%22also%20hidden%20for%20screenreaders%22%20tabindex%3D%220%22%3E%3C%2Fspan%3E%3C%2Flabel%3E%20%3C%2Fdiv%3E%20%3Cdiv%20class%3D%22input%22%3E%20%3Cinput%20type%3D%22checkbox%22%20name%3D%22options%22%20id%3D%22o-visuallyhidden%22%3E%20%3Clabel%20for%3D%22o-visuallyhidden%22%3EMark%20visually%20hidden%20%3Cspan%20class%3D%22tooltip%22%20title%3D%22only%20visible%20for%20screenreaders%22%20tabindex%3D%220%22%3E%3C%2Fspan%3E%3C%2Flabel%3E%20%3C%2Fdiv%3E%20%3C%2Fdiv%3E%20%3C%2Ffieldset%3E%20%3C%2Fheader%3E%20%3Cmain%20id%3D%22result%22%20class%3D%22result%22%3E%20%3C%2Fmain%3E%20%3C%2Fbody%3E%20%3C%2Fhtml%3E%20')%2Ct.close()%3Bvar%20i%3Dt.querySelector('%5Bdata-action%3D%22close%22%5D')%3Bi%26%26i.addEventListener(%22click%22%2Cfunction(e)%7Bdocument.body.removeChild(container)%2Cdocument.getElementById(highlighterEl.id)%26%26document.body.removeChild(highlighterEl)%7D)%3Bvar%20o%3Dt.querySelector(%22%23result%22)%3Bo%26%26(o.innerHTML%3DgetOutlineAsHTML())%2Ce(%22o-hidden%22%2C%22show-hidden%22)%2Ce(%22o-visuallyhidden%22%2C%22mark-visuallyhidden%22)%2Ct.addEventListener(%22mouseover%22%2Cfunction(e)%7Bvar%20t%3Bif(%22A%22%3D%3D%3De.target.nodeName.toUpperCase()%3Ft%3De.target%3Ae.target.parentElement%26%26%22A%22%3D%3D%3De.target.parentElement.nodeName.toUpperCase()%26%26(t%3De.target.parentElement)%2Ct)%7Bconsole.log(%22Link%22%2Ct)%3Bvar%20i%3Ddocument.querySelector(t.getAttribute(%22href%22))%3Bconsole.log(%22Target%22%2Ci)%2ChighlightElement(i)%7D%7D%2C!1)%7D%2Cdocument.body.appendChild(container)%3B}())">H1️⃣2️⃣3️⃣</a>
</body>
</html>
