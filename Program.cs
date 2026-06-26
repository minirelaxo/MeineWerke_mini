// See https://aka.ms/new-console-template for more information
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

namespace MyApp
{

    class Program
    {

            static void Main(string[] args)
            {   

                Console.WriteLine("------------------------------------");
                Console.WriteLine("         Server Maker V.1.0.0.0     ");
                Console.WriteLine("------------------------------------");

                Console.WriteLine("schreibe die zahl ");
                Console.WriteLine("------------------");

                Console.WriteLine("1-Exit");
                Console.WriteLine("2-Create_Server");
                Console.WriteLine("3-Server_Löschen");

                string? ram1 = Console.ReadLine();
                if (!int.TryParse(ram1, out int ram_9))
                {
                    Console.WriteLine("Ungültige Eingabe. Programm wird beendet.");
                    return;
                }

                switch (ram_9)
                {
                    case 1:
                        Environment.Exit(0);
                        break;
                    case 2:
                        Console.WriteLine("was soll es für ein server sein?");
                        Console.WriteLine("1-Discord");
                        Console.WriteLine("2-Teamspeak");
                        Console.WriteLine("3-Minecraft");

                        string? typeInput = Console.ReadLine();
                        if (!int.TryParse(typeInput, out int ram_10))
                        {
                            Console.WriteLine("Ungültige Eingabe.");
                            break;
                        }

                        switch (ram_10)
                        {
                            case 1:
                                Console.WriteLine("nicht programmiert");
                                break;
                            case 2:
                                Console.WriteLine("nicht programmiert");
                                break;
                            case 3:
                                Console.WriteLine("--------------------------------");
                                Console.WriteLine("       Minecraft Server          ");
                                Console.WriteLine("--------------------------------");

                                Console.Write("wie soll der server heißen? ");
                                string? serverName = Console.ReadLine();

                                Console.WriteLine("welche Softwer");
                                Console.WriteLine("1. Spigot");
                                Console.WriteLine("2. Bukkit");
                                Console.WriteLine("3. Vanilla Server");
                                Console.WriteLine("4. Minecraft Forge");
                                Console.WriteLine("5. Minecraft Pi");
                                Console.WriteLine("6. CraftBukkit");
                                Console.WriteLine("7. PocketMine-MP");
                                Console.WriteLine("8. Paper");
                                Console.WriteLine("9. Eine Vorlage");

                                string? swInput = Console.ReadLine();
                                if (!int.TryParse(swInput, out int ram4))
                                {
                                    Console.WriteLine("Ungültige Eingabe.");
                                    break;
                                }

                                switch (ram4)
                                {
                                    case 1:
                                        Console.WriteLine("Spigot wird erstellt");
                                        break;
                                    case 2:
                                        Console.WriteLine("Bukkit wird erstellt");
                                        break;
                                    case 3:
                                        Console.WriteLine("Vanilla Server wird erstellt");
                                        break;
                                    case 4:
                                        Console.WriteLine("Minecraft Forge wird erstellt");
                                        break;
                                    case 5:
                                        Console.WriteLine("Minecraft Pi wird erstellt");
                                        break;
                                    case 6:
                                        Console.WriteLine("CraftBukkit wird erstellt");
                                        break;
                                    case 7:
                                        Console.WriteLine("PocketMine-MP wird erstellt");
                                        break;
                                    case 8:
                                        Console.WriteLine("Paper wird erstellt");
                                        break;
                                    case 9:
                                        Console.WriteLine("welche Vorlage willst du benutzen?");
                                        Console.WriteLine("--------------------------------");

                                        Console.WriteLine("1. Vanilla + Vorlage");
                                        Console.WriteLine("2. Create live 6 Vorlage");
                                        Console.WriteLine("3. 5 Gelb Vorlage");

                                        if  (int.TryParse(Console.ReadLine(), out int ram5))
                                        {
                                            switch (ram5)
                                            {
                                                case 1:
                                                    Console.WriteLine("Vanilla + Vorlage wird erstellt");
                                                    break;
                                                case 2:
                                                    Console.WriteLine("Create live 6 Vorlage wird erstellt");
                                                    break;
                                                case 3:
                                                    Console.WriteLine("5 Gelb Vorlage wird erstellt");
                                                    break;
                                                default:
                                                    Console.WriteLine("Ungültige Auswahl.");
                                                    break;
                                            }
                                        }
                                        else
                                        {
                                            Console.WriteLine("Ungültige Eingabe.");
                                        }


                                        break;
                                    default:
                                        Console.WriteLine("Unbekannte Auswahl.");
                                        break;
                                }

                                break;
                            default:
                                Console.WriteLine("Unbekannter Server-Typ.");
                                break;
                        }

                        break;
                    case 3:
                        Console.WriteLine("hi3");
                        break;
                    default:
                        Console.WriteLine("Ungültige Auswahl.");
                        break;
                }
            }
        }
    }





