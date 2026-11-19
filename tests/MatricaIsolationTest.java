import java.util.LinkedList;import org.junit.Test;import static org.junit.Assert.*;
public class MatricaIsolationTest {
 private LinkedList<Zeton> environment(){LinkedList<Zeton> t=new LinkedList<Zeton>();String[] a={"околина","(","2",",","3",")","ѕидови","почеток","крај","жетони","почеток","крај","робот","И","(","0",",","0",")"};for(String s:a)t.add(new Zeton(s,"test",1,1));return t;}
 @Test public void worldsDoNotShareMapState(){Matrica a=new Matrica(environment()),b=new Matrica(environment());int[][] copy=a.vrati_mapa();copy[0][0]=99;assertEquals(0,a.vrati_mapa()[0][0]);assertEquals(0,b.vrati_mapa()[0][0]);assertNotSame(a.vrati_mapa(),b.vrati_mapa());}
}