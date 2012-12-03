package modoohi.springmvc.test.common.controller;

import javax.annotation.Resource;

import modoohi.springmvc.test.common.dao.*;

import org.springframework.stereotype.Controller;

@Controller
public class ComController {
	
	@Resource(name="commonDao")
	private CommonDao commonDao;
	

	/**
	 * Simply selects the home view to render by returning its name.
	 
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		System.out.println("sss");
		return "home";
	}
	*/
	/**
	 * Simply selects the home view to render by returning its name.

	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public String home2(Locale locale, Model model) {
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		System.out.println("aaaa");
		return "home";
	}
		 */
}